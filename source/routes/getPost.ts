import { Router } from "express";
import { JWT } from "../middlewares/jwt.auth";
import { User_controller_O } from "../utils/user.controller";
import {z, ZodError} from "zod";
import {redis} from '../services/redis.config';
import { getPostType } from "../types/user.auth";
import { ORDER_BY_ID_Post } from "../utils/utils";

export const getPost = Router()
const instanceJWT = new JWT()

getPost.get("/post/:postId",instanceJWT.auth_tk_provided_by_user,async(request,response)=>{
    const getParser = z.object({
        postId:z.string()
    })
    try {
        const {postId} = getParser.parse(request.params)
        const data_from_redis = await redis.get(`postId:${postId}`)
        if(data_from_redis){
            response.status(200).json({
                post:JSON.parse(data_from_redis)
            })
        }else{
            const user = new User_controller_O()
            const ids = new Set<string>()
            const data:{success:boolean,message?:string,result?:getPostType[]}= await user.get_post_from_id(postId)
            
            if(data.success && data.result && data.result?.length > 0){
                const result : getPostType[] = data.result!.map(e=>{
                    ids.add(e.post_id)
                    return e!
                })

                const r = ORDER_BY_ID_Post(result,[...ids])
                const ok =await redis.setEx(`postId:${postId}`,360,JSON.stringify(r))

                if(ok){
                    response.status(200).json({
                        post:[...r]
                    })

                }else{
                    response.status(400).json({
                        message:"nothing"
                    })
                }
            }else{
                response.status(400).json({
                    message:data.message
                })
            }
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