# CollabSphere Project Manager

A modern, high-performance project management tool built with React, React Router, Node.js, and MongoDB.

## Features
- **Flexible Workspaces**: Organize teams and projects.
- **Task Management**: Create, assign, and track tasks.
- **Analytics**: Visualize productivity and project status.
- **Authentication**: Secure login and signup flows.

## Tech Stack
- **Frontend**: React, React Router, Tailwind CSS, Shadcn UI, Recharts
- **Backend**: Node.js, Express, Mongoose (MongoDB)
- **Tools**: Vite, Nodemon

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the repository**
2.  **Install Frontend Dependencies**
    ```bash
    cd frontend
    npm install
    ```
3.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

### Configuration

1.  **Backend Environment**
    - Navigate to `backend/`
    - Copy `.env.example` to `.env`
    - Update the variables (MongoDB URI, JWT Secret, etc.)
    ```bash
    cp .env.example .env
    ```

### Running the Application

1.  **Start Backend Server**
    ```bash
    cd backend
    npm run dev
    ```
    Runs on `http://localhost:5000`

2.  **Start Frontend Development Server**
    ```bash
    cd frontend
    npm run dev
    ```
    Runs on `http://localhost:5173`

## Scripts

### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run typecheck`: Run TypeScript checks

### Backend
- `npm run dev`: Start development server with Nodemon
- `npm start`: Start production server
