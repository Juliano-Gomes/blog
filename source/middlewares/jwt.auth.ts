import { Request,Response,NextFunction } from 'express'
import {JsonWebTokenError, sign,verify} from 'jsonwebtoken'

export class JWT{
    secret : string = process.env.JTW_SECRET_KEY!
    async auth_user_tk(data:{
        username: string,
    }):Promise<{success:boolean,token?:string}>{
        try {
            const response = sign(data.username,this.secret)

            if(response.trim() !== "" && response !== null){
                return{
                    success:true,
                    token:response
                }
            }else{
                return{
                    success:false
                }
            }
        } catch (error) {
            return{
                success: false,
            }
        }
    }

    async auth_tk_provided_by_user(request:Request,response:Response,next:NextFunction){
        try {
            const token = request.headers.authorization?.split(" ")

            if(token && token?.length > 0 && token[1].trim() !== ""){
                const decoded = verify(token[1],this.secret)
                
                console.log({
                    code : decoded,
                    message:"Jwt",
                    secret:this.secret
                })

                if(decoded){
                    next()
                }else{
                    response.status(403).json({
                        message:"Not authorized to access this resource",
                        html:"<h1>You're not authorized to access it</h1>"
                    })
                }
            }else{
                response.status(403).json({
                    message:"Not authorized to access this resource",
                    html:"<h1>You're not authorized to access it</h1>"
                })
            }
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                response.status(403).json({
                    message:"Not authorized to access this resource",
                    html:"<h1>You're not authorized to access it</h1>"
                })
            }else{
                response.status(500).json({
                    message:"server error, try again later !!"
                })
            }
        }
    }  
}