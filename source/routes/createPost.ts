import { Router } from "express";
import { JWT } from "../middlewares/jwt.auth";
import { User_controller_O } from "../utils/user.controller";
import { IMAGE } from "../services/multer.config";
import multer,{MulterError} from 'multer'
import {z} from "zod";

const Config = multer({
    storage:IMAGE
})

export const POST = Router()
const instanceJWT = new JWT()

POST.post("/newPost",instanceJWT.auth_tk_provided_by_user,Config.single("postImage"),async(request,response)=>{
    const postParser = z.object({
        title:z.string(),
        author:z.string()
    })
    try {
        const image =request.file
        const {author,title} = postParser.parse(request.body)

        const c = new User_controller_O()
        const {message,success} =await c.POST_ADD({
            title,
            author,
            image:image?.destination
        })
        if(success){
            response.status(201).json({message})
        }else{
            response.status(400).json({message})
        }
    } catch (error) {
        if(error instanceof MulterError) {
            response.status(400).json({message:"Error uploading image"});
        }
        else{
            response.status(500).json({message:"Error creating post"});
        }
    }
})