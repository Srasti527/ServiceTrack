import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { PlusCircle, Clock, CheckCircle, Search, Star, LogOut } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState({ title: '', description: '' });

  // Review states
  const [reviewModal, setReviewModal] = useState({ open: false, serviceId: null, providerId: null });
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
const [reviews, setReviews] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  // const fetchRequests = async () => {
  //   try {
  //     const { data } = await api.get('/services/my-requests');
  //     setRequests(data);
const fetchRequests = async () => {
  try {
    const { data } = await api.get('/services/my-requests');
    setRequests(data);

    const reviewsData = {};

    for (let req of data) {
      // DEBUG LINE (important)
      console.log("ACCEPTED BY:", req.acceptedBy);

      if (req.status === 'completed' && req.acceptedBy?._id) {
        const res = await api.get(`/reviews/provider/${req.acceptedBy._id}`);
        reviewsData[req._id] = res.data;
      }
    }

    setReviews(reviewsData);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
//  const fetchRequests = async () => {
//   try {
//     const { data } = await api.get('/services/my-requests');
//     setRequests(data);

//     // 🔥 NEW CODE START
//     const reviewsData = {};

//     for (let req of data) {
//       if (req.status === 'completed') {
//         const res = await api.get(`/reviews/provider/${req.acceptedBy?._id}`);
//         reviewsData[req._id] = res.data;
//       }
//     }

//     setReviews(reviewsData);
//     // 🔥 NEW CODE END

//   } catch (err) {
//     console.error(err);
//   } finally {
//     setLoading(false);
//   }
// };



  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services', newService);
      setIsModalOpen(false);
      setNewService({ title: '', description: '' });
      fetchRequests();
    } catch (error) {
      alert('Error creating service');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        serviceId: reviewModal.serviceId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      setReviewModal({ open: false, serviceId: null, providerId: null });
      setReviewData({ rating: 5, comment: '' });
      alert('Review submitted successfully!');
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              ST
            </div>
            <h1 className="text-xl font-bold text-dark-900 tracking-tight">ServiceTrack User</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-dark-600 font-medium hidden sm:block">Hello, {user?.name}</span>
            <button 
              onClick={logout}
              className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">My Requests</h2>
            <p className="text-slate-500 mt-1">Manage and track your requested services</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            <PlusCircle className="w-5 h-5" />
            New Request
          </button>
        </div>

        {loading ? (
          <div className="grid place-items-center h-64">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700">No requests yet</h3>
            <p className="text-slate-500">Create your first service request to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map(req => (
              <div key={req._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  req.status === 'completed' ? 'bg-green-500' :
                  req.status === 'in-progress' ? 'bg-blue-500' :
                  req.status === 'accepted' ? 'bg-yellow-500' : 'bg-slate-300'
                }`}></div>
                
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{req.title}</h3>
                  {req.acceptedBy && (
                      <p className="text-sm text-slate-500">
                            Provider: {req.acceptedBy.name}
                           </p>
                             )}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap
                    ${req.status === 'completed' ? 'bg-green-100 text-green-700' :
                      req.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      req.status === 'accepted' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}
                  `}>
                    {req.status}
                  </span>
                </div>
                
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 h-14">
                  {req.description}
                </p>

                   {reviews[req._id] && reviews[req._id].length > 0 && (
                   <div className="mt-4 border-t pt-3">
                     <h4 className="text-sm font-semibold text-slate-700 mb-2">Reviews:</h4>
                          {reviews[req._id].map(r => (
                          <div key={r._id} className="text-sm text-slate-600 mb-2">
                             ⭐ {r.rating} - {r.comment}
                             </div>
                                  ))}
                                      </div>
                                      )}




                <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {req.status === 'completed' && (
                    <button 
                      onClick={() => setReviewModal({ open: true, serviceId: req._id, providerId: req.acceptedBy?._id })}
                      className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
                    >
                      <Star className="w-4 h-4" /> Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Request</h2>
            <form onSubmit={handleCreateService} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Service Title</label>
                <input 
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                  value={newService.title}
                  onChange={e => setNewService({...newService, title: e.target.value})}
                  placeholder="e.g. Plumbing Repair, House Cleaning"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea 
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all resize-none"
                  value={newService.description}
                  onChange={e => setNewService({...newService, description: e.target.value})}
                  placeholder="Describe what you need help with..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal.open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Leave a Review</h2>
            <form onSubmit={handleSubmitReview} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewData({...reviewData, rating: num})}
                      className={`p-2 rounded-lg transition-colors ${reviewData.rating >= num ? 'text-yellow-400 bg-yellow-50' : 'text-slate-300 bg-slate-50 hover:bg-slate-100'}`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Comment</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all resize-none"
                  value={reviewData.comment}
                  onChange={e => setReviewData({...reviewData, comment: e.target.value})}
                  placeholder="How was the service?"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setReviewModal({ open: false, serviceId: null, providerId: null })}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors shadow-md"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
