import { Router } from "express";
import { JWT } from "../middlewares/jwt.auth";
import { User_controller_O } from "../utils/user.controller";
import {z, ZodError} from "zod";


export const AddLikes = Router()
const instanceJWT = new JWT()

AddLikes.put('/like',instanceJWT.auth_tk_provided_by_user,async(request,response)=>{
    const lParser = z.object({post_id:z.string()})

    try {
        const {post_id} = lParser.parse(request.body)

        const user = new User_controller_O()
        const r = await user.adLikes({post_id})

        if(r.success){
            response.status(200).json({message:r.message})
        }else{
            response.status(404).json({message:r.message})
        }
    } catch (error) {
        if(error instanceof ZodError){
            response.status(406).json({message:"Invalid post data"})
        }else{
            response.status(500).json({message:"internal server error"})
        }
    }
})