import {z} from "zod";

const signupSchema = z.object({
    name:z.string().min(3,"Name is Required"),
    email:z.string().email("Invalid email format").min(1,"Email is Required"),
    password:z.string().min(8,"Password must be at least 8 characters long"),
})

const signinSchema = z.object({
    email:z.string().email("Invalid email format").min(1,"Email is Required"),
    password:z.string().min(8,"Password must be at least 8 characters long"),
})

const verifyEmailSchema=z.object({token:z.string().min(1,"Token is Required"),})

export {signupSchema,signinSchema,verifyEmailSchema}