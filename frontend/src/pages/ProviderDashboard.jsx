import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Briefcase, CheckCircle, PlayCircle, Loader2, LogOut } from 'lucide-react';

const ProviderDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [availableServices, setAvailableServices] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
const [reviews, setReviews] = useState({});


  useEffect(() => {
    fetchData();
  }, []);

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const [availableRes, tasksRes] = await Promise.all([
  //       api.get('/services/available'),
  //       api.get('/services/my-tasks')
  //     ]);
  //     setAvailableServices(availableRes.data);
  //     setMyTasks(tasksRes.data);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const fetchData = async () => {
  setLoading(true);
  try {
    const [availableRes, tasksRes] = await Promise.all([
      api.get('/services/available'),
      api.get('/services/my-tasks')
    ]);

    setAvailableServices(availableRes.data);
    setMyTasks(tasksRes.data);

    // 🔥 FETCH REVIEWS FOR PROVIDER
    const reviewsData = {};

    for (let task of tasksRes.data) {
      if (task.status === 'completed') {
        const res = await api.get(`/reviews/service/${task._id}`);
        reviewsData[task._id] = res.data;
      }
    }

    setReviews(reviewsData);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};



  const handleAccept = async (id) => {
    try {
      await api.put(`/services/${id}/accept`);
      fetchData();
    } catch (error) {
      alert('Error accepting service');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/services/${id}/status`, { status });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight">Provider Portal</h1>
              <p className="text-xs text-slate-400">ServiceTrack Business</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300 font-medium hidden sm:block">{user?.name}</span>
            <button 
              onClick={logout}
              className="text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl mb-8 w-max border border-slate-700/50">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'available' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Job Market ({availableServices.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'tasks' 
                ? 'bg-teal-500 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            My Active Tasks ({myTasks.filter(t => t.status !== 'completed').length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {activeTab === 'available' && (
              availableServices.length === 0 ? (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/30">
                  <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg text-slate-300 font-medium">No new jobs available.</h3>
                  <p className="text-slate-500">Check back later for new requests.</p>
                </div>
              ) : (
                availableServices.map(service => (
                  <div key={service._id} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Briefcase className="w-24 h-24 text-emerald-500" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                      <p className="text-slate-400 text-sm mb-6 line-clamp-3 h-14">{service.description}</p>
                      
                      <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
                        <span>By: <span className="text-slate-300 font-medium">{service.requestedBy.name}</span></span>
                      </div>
                      
                      <button 
                        onClick={() => handleAccept(service._id)}
                        className="mt-6 w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 font-medium py-3 rounded-xl transition-all"
                      >
                        Accept Job
                      </button>
                    </div>
                  </div>
                ))
              )
            )}

            {activeTab === 'tasks' && (
              myTasks.length === 0 ? (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/30">
                  <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg text-slate-300 font-medium">No active tasks.</h3>
                  <p className="text-slate-500">Go to the Job Market to accept requests.</p>
                </div>
              ) : (
                myTasks.map(task => (
                  <div key={task._id} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${
                      task.status === 'completed' ? 'bg-emerald-500' :
                      task.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></div>

                    <div>
                      <div className="flex justify-between items-start mb-4">
                         <h3 className="text-xl font-bold text-white">{task.title}</h3>
                         <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap
                          ${task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                            task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'}
                        `}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-6">{task.description}</p>
                      {reviews[task._id] && reviews[task._id].length > 0 && (
                         <div className="mt-4 border-t border-slate-700 pt-3">
                           <h4 className="text-sm font-semibold text-slate-300 mb-2">Reviews:</h4>
                            {reviews[task._id].map(r => (
                          <div key={r._id} className="text-sm text-slate-400 mb-2">
                            ⭐ {r.rating} - {r.comment}
                             </div>
                                 ))}
                                </div>
                                  )}
                                 </div>

                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      {task.status === 'accepted' && (
                        <button 
                          onClick={() => handleStatusUpdate(task._id, 'in-progress')}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          <PlayCircle className="w-5 h-5" /> Mark In-Progress
                        </button>
                      )}
                      
                      {task.status === 'in-progress' && (
                        <button 
                          onClick={() => handleStatusUpdate(task._id, 'completed')}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" /> Mark Completed
                        </button>
                      )}

                      {task.status === 'completed' && (
                        <div className="w-full bg-emerald-500/10 text-emerald-500 font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 border border-emerald-500/20">
                          <CheckCircle className="w-5 h-5" /> task Completed
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderDashboard;
