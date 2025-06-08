import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;

// Root route
app.get("/", async (req, res) => {
    res.status(200).json({
        message: "Welcome to the backend server"
    });
});

// Error handling middleware (must have 4 args: err, req, res, next)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Internal Server Error",
        error: err.message
    });
});

// 404 middleware - catch unmatched routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
