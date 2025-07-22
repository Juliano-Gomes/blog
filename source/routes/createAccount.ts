import { Router } from "express";
import {z, ZodError} from "zod";
import { User_controller_O } from '../utils/user.controller';


export const Account = Router();

Account.post("/createAccount",async(request,response)=>{
    const newPass = z.object({
        name:z.string(),
        email: z.string().email(),
        password: z.string().min(8)
    })

    try {
        const {name,email,password} = newPass.parse(request.body)
        //code verification
        if(name.trim() !== "" && password.trim() !== "" && email.includes("@")){
            const user = new User_controller_O()
            const rs = await user.CREATE_USER({
                name:name,
                email:email,
                password:password
            }) 

            if(rs.success){
                response.status(201).json({
                    message:rs.message
                })
            }else{
                response.status(400).json({
                    message:rs.message
                })
            }
        }else{
            response.status(400).json({
                message:"invalid data type , please provide the correct ones !!"
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