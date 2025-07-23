import { User_controller_O } from "../utils/user.controller";
import { JWT } from "../middlewares/jwt.auth";
import {z, ZodError} from 'zod'
import { Router } from "express";
import { betterResponse, userRowAtributes } from "../types/user.auth";


export const LOGGER=Router()

LOGGER.post("/loginUSer",async(request,response)=>{
    const userParser = z.object({
        email:z.string().email(),
        password:z.string().min(7)
    })
    try {
        const user = new User_controller_O()
        const tk = new JWT()
        const {email,password} = userParser.parse(request.body)
        const data = await user.LOG_USER({email,password})
        //IS Logged IN
        if(data.success && data.data && data.data.rows.length > 0){
            const ARows : userRowAtributes[] = data.data.rows
            const betterResponse:betterResponse[]=ARows.map(e=>{
                return {
                    username:e.name,
                    email:e.email,
                    post:[
                        {
                            postname:e.title,
                            postAuthor:e.author,
                            postComents:e.comment,
                            postCommenter:e.commenter,
                        }
                    ],
                    postCreatedAt:e.created_at
                }
            })
            const name = data.data.rows[0].name
            console.log("my name id : ",name)
            if(name){
                const token = await tk.auth_user_tk({
                    username:name
                })

                if(token.success && token.token){
                    //final response
                    response.status(201).json({
                        token:token.token,
                        data:[...betterResponse]
                    })
                }else{
                    console.log(token)
                    response.status(500).json({
                        message:"internal server error"
                    })
                }
            }
        }else{
            response.status(400).json({
                message:data.message
            })
        }
    } catch (error) {
        if(error instanceof ZodError){
            response.status(406).json({
                message:"invalid data type provided"
            })
        }else{
            response.status(500).json({
                message:"a server error has occurred!! :("
            })
        }
    }
})
