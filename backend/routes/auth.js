import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import { signupSchema, signinSchema,verifyEmailSchema } from '../libs/validate-schema.js';
import { signupUser, signinUser,verifyEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/sign-up', validateRequest({ body: signupSchema }), signupUser);
router.post('/sign-in', validateRequest({ body: signinSchema }), signinUser);
router.post('/verify-email',validateRequest({
    body:verifyEmailSchema,
}),verifyEmail)

export default router;
