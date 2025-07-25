import { Router } from "express";
import { JWT } from "../middlewares/jwt.auth";
import { User_controller_O } from "../utils/user.controller";
import {z, ZodError} from "zod";


export const deletePost = Router()
const instanceJWT = new JWT()

deletePost.delete("/deletePost/:postId",instanceJWT.auth_tk_provided_by_user,async(request,response)=>{
    const getParser = z.object({
        postId:z.string(),
    })
    try {
        const {postId} = getParser.parse(request.params)
        const mandator = request.headers.mandator as string

        const user = new User_controller_O()
        const d = await user.deletePost(postId,mandator)
        
        if(d.success){
            response.status(200).json({message:d.message})
        }else{
            response.status(400).json({message:d.message})
        }
    }  catch (error) {
            if(error instanceof ZodError){
                response.status(406).json({
                    message:"invalid data type"
                })
            }else{
                response.status(500).json({
                    message:"internal server error !"
                })
            }
        }
})