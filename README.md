# ServiceTrack

ServiceTrack is a modern, full-stack platform that connects users who need local services (like home repairs, cleaning, etc.) with the professional providers who fulfill them. Built with a premium, dynamic UI using the complete MERN stack.

## 🚀 Tech Stack

*   **Frontend**: React.js (built with Vite), Tailwind CSS for styling, React Router DOM for navigation, Axios for HTTP requests, and Lucide React for consistent icons.
*   **Backend**: Node.js, Express.js for the REST API architecture, JWT (`jsonwebtoken`) for secure authentication, and `bcrypt` for password hashing.
*   **Database**: MongoDB (via Mongoose for schema modeling).

## 📁 Project Structure

The project is divided into two main folders:
*   `/frontend` - Contains the React.js client application. 
*   `/backend` - Contains the Node.js/Express server and REST API.


## 🛠️ How to Run Locally

### 1. Start the Backend server
Open a terminal and execute the following commands:
```bash
cd backend
npm install
npm run dev
```
*Note: Make sure your local MongoDB instance is running, or replace `MONGODB_URI` with an Atlas connection string.*

### 2. Start the Frontend app
Open a second terminal window and execute:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start running on the Vite development server (usually `http://localhost:5173`).

## 🧱 Build & Start Commands

*   **Frontend Build**: `npm run build` inside the `frontend` directory (outputs static files to the `/dist` folder).
*   **Backend Production Start**: `npm start` (runs `node server.js`).

## 🌐 Production-Ready Deployment Steps

To take this application live, you need to make the following changes:

1.  **Database**: Migrate from the local MongoDB instance (`127.0.0.1`) to a cloud-hosted MongoDB Atlas cluster. Update your deployed `.env` to use the Atlas URI string.
2.  **Environment Variables**: Change `JWT_SECRET` to a strong, random, secure string in your production environment variables. Ensure `PORT` is consumed via `process.env.PORT` which is assigned by the hosting provider.
3.  **CORS Configuration**: In `backend/server.js`, restrict `cors()` to only accept requests originating from your specific frontend deployment domain.
4.  **Frontend API Path**: Update Axios base URLs in the frontend to point to the live backend URL, rather than `http://localhost:5000`. 
5.  **Hosting Platforms**:
    *   Deploy the `frontend` via Vercel or Netlify.
    *   Deploy the `backend` via Heroku, Render, or Railway.

## ✨ Core Features
*   **Role-based Dashboards**: Distinct workflows for standard `User` vs `Provider`.
*   **Job Market**: Providers can browse open service requests and claim them.
*   **Service Lifecycle**: Tasks move from *Pending* ➔ *In-Progress* ➔ *Completed*.
*   **Reviews**: Users can submit star ratings and reviews for completed tasks.
