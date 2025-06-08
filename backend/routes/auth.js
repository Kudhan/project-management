import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
import User from '../models/User.js';
import { validateRequest } from 'zod-express-middleware';
import { signupSchema,signinSchema } from '../libs/validate-schema.js';
import { signupUser, signinUser } from '../controllers/authController.js';

const router = express.Router();

router.post("/signup",
    
    validateRequest({body:signupSchema}),
    
    async(req,res)=>{
        signupUser

});

router.post("/signin",
    
    validateRequest({body:signinSchema}),
    
    async(req,res)=>{
        signinUser

});

export default router;