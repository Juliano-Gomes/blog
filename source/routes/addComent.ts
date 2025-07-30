import { Router } from "express";
import { JWT } from "../middlewares/jwt.auth";
import { User_controller_O } from "../utils/user.controller";
import {z, ZodError} from "zod";


export const AddComment = Router()
const instanceJWT = new JWT()

AddComment.post('/add_comment/',instanceJWT.auth_tk_provided_by_user,async(request,response)=>{
    const cParser = z.object({
        commenter :z.string(),
        comment:z.string(),
        post_id:z.string()
    })

    try {
        const {comment,commenter,post_id} = cParser.parse(request.body)

        //code...
        const user = new User_controller_O()
        const r = await user.ad_c({
            comment,
            commenter,
            post_id
        })

        if(r.success){
            response.status(200).json({message:r.message})
        }else{
            response.status(400).json({message:r.message})
        }
    } catch (error) {
        if(error instanceof ZodError){
            response.status(406).json({
                message:"invalid data type!"
            })
        }else{
            response.status(500).json({
                message:"internal server error"
            })            
        }
    }
})