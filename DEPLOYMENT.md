# Deployment Guide

This guide covers deploying the **Frontend to Vercel** and the **Backend to Render**.

## 1. Backend Deployment (Render)

We will deploy the Node.js/Express backend to Render.com.

### Steps:
1.  **Push your code** to a GitHub repository (Ensure `backend` folder is included).
2.  **Log in to Render** and create a **“Web Service”**.
3.  **Connect your GitHub repo**.
4.  **Configure the Service**:
    *   **Root Directory**: `backend`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install` (We added this script to `package.json`)
    *   **Start Command**: `npm start`
5.  **Environment Variables**:
    Current `.env.example` values need to be set in Render:
    *   `MONGODB_URI`: Connection string to your MongoDB Atlas cluster.
    *   `JWT_SECRET`: A strong secret key.
    *   `CLIENT_URL`: The URL of your deployed Frontend (e.g., `https://your-app.vercel.app`). **Required for Socket.io & CORS**.
    *   `PORT`: `5000` (Render creates a `PORT` variable automatically, but good to have fallback).
    *   `BREVO_API_KEY`: Your Brevo API Key (starts with `xkeysib-`).
    *   `FROM_EMAIL`: The sender email address (e.g., `no-reply@yourdomain.com`).

## 2. Frontend Deployment (Vercel)

We will deploy the React Router v7 application to Vercel. Since `ssr: true` is enabled, we need to use the Vercel adapter.

### Steps:

1.  **Install the Vercel Adapter** (Run in `frontend` directory):
    ```bash
    cd frontend
    npm install -D @vercel/react-router
    ```

2.  **Update Configuration**:
    Modify `frontend/react-router.config.ts` to use the Vercel preset:
    ```typescript
    import type { Config } from "@react-router/dev/config";
    import { vercelPreset } from "@vercel/react-router/vite";

    export default {
      ssr: true,
      presets: [vercelPreset()],
    } satisfies Config;
    ```

3.  **Deploy to Vercel**:
    *   **Push changes** to GitHub.
    *   **Log in to Vercel** and “Add New Project”.
    *   **Import the repository**.
    *   **Configure the Project**:
        *   **Root Directory**: `frontend`
        *   **Framework Preset**: Other (or React Router v7 if available detected, but ensure Build Command is `react-router build`)
        *   **Environment Variables**:
            *   `VITE_API_URL`: The URL of your deployed Backend (e.g., `https://your-api.onrender.com`).
            *   *(Note: React Router/Vite exposes env vars starting with `VITE_` to the client)*.

4.  **Update Backend CORS**:
    Once the frontend is live (e.g., `https://project-manager-frontend.vercel.app`), go back to Render and update the `CLIENT_URL` environment variable to this URL so CORS and Socket.io allow requests.

## 3. Final Verification

*   Check that the Frontend loads.
*   Try Logging in (this tests connection to Backend).
*   Correct any Environment Variable mismatches (URLs are the most common issue).
