import {redis} from '../services/redis.config';
import { Router } from "express";
import {z, ZodError} from "zod";
import {v4 as uuid} from 'uuid';
import { Email } from '../services/mail.config';


export const ForgotPassRouter = Router();

ForgotPassRouter.post("/reset_Link",async(request,response)=>{
    const forgotParser = z.object({
        email: z.string().email()
    })

    try {
        const { email } = forgotParser.parse(request.body);
        const code = uuid();
        
        const r = await redis.setEx(`rest-code-${email}`,1800,code)
        if(r){
            const r2 = await Email.sendMail({
                from: process.env.USER,
                to: email,
                subject: 'Password Reset Link',
                text: `This is the reset password code ${code} . It will expire in 30 minutes.Don't share it with anyone !!`, 
            })
            
            response.status(200).json({
                message: "we've sent you a reset code to your email",
            });
        }
        //console.log(code)
    } catch (error) {
        if(error instanceof ZodError){
            response.status(406).json({
                message:"invalid data type"
            })
        }else{
            response.status(500).json({
                message:"internal server error"
            })
        }
    }
})
