# ServiceTrack - Local Service Trust Platform

A full-stack MERN application for managing local service requests between users and providers. Built with a premium, dynamic UI using Tailwind CSS and React.

## Features
- **Authentication**: JWT-based secure authentication with bcrypt password hashing.
- **Roles**: Distinct `user` and `provider` portals.
- **Service Workflow**:
  - Users create service requests.
  - Providers view the "Job Market" and accept pending tasks.
  - Providers transition task status to "in-progress" and "completed".
  - Users can review completed tasks.
- **Clean Architecture**: Built following the MVC pattern.

## Tech Stack
- **Database**: MongoDB & Mongoose
- **Backend Frameowrk**: Express.js, Node.js
- **Frontend Framework**: React (Vite)
- **Styling**: Tailwind CSS, Lucide Icons

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make sure MongoDB is running locally on port `27017` (or change `MONGODB_URI` in `backend/.env`).
   *If you do not have MongoDB running locally, update the `MONGODB_URI` to a MongoDB Atlas cluster URL.*
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Usage Flow
1. **Register** as a "Standard User" or "Service Provider".
2. Switch accounts or run two incognito windows to test both views.
3. User: Click **New Request** to create a job.
4. Provider: View the job in **Job Market** and click **Accept Job**.
5. Provider: In **My Active Tasks**, mark the job as **In-Progress**, then **Completed**.
6. User: See the status update to "completed" and leave a **Review**.
