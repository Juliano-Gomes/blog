import {redis} from '../services/redis.config';
import { Router } from "express";
import {z, ZodError} from "zod";

export const ResetPassRouter = Router();

ResetPassRouter.post("/newPass",async(request,response)=>{
    const newPass = z.object({
        code:z.string(),
        password: z.string().min(8),
        email: z.string().email()
    })

    try {
        const {code,email,password} = newPass.parse(request.body);
        const r = await redis.get(`rest-code-${email}`)
        //code verification
        if(r !== null && typeof(r) === 'string'){
            if(r.trim().toLowerCase() === code.trim().toLowerCase()){
                //reset password logic here
                response.status(200).json({
                    message: "Password reset successfully",
                })
            }else{
                return response.status(400).json({
                    message: "invalid code,try to generate a new reset code"
                })
            }
        }else{
            return response.status(400).json({
                message: "invalid code,try to generate a new reset code"
            })
        }
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