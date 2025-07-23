import { user_schema } from "../database/user.database";
import { compare, genSalt, hash } from "bcrypt";
import { QueryResult } from "pg";
import { v4 as uuid } from "uuid";

export class User_controller_O extends user_schema {
    constructor() {
        super();
    }
    private async HASH(data:{passwd:string}):Promise<{passwd?:string,success:boolean}>{
        try {
            const salt = await genSalt(Number(process.env.SALT),"b")
            const password = await hash(data.passwd,salt)

            if(password){
                return {
                    passwd:password,
                    success:true}
            }else{
                return{
                    success:false
                }
            }
        } catch (error) {
            return{
                success:false
            }
        }
    }

    private async DECRYPT(data:{passwd:string,hash:string}):Promise<boolean>{
        try {
            const response = await compare(data.passwd,data.hash)
            return response
        } catch (error) {
            return false
        }
    }

    async UPDATE_PASS(data:{email:string,newPass:string}):Promise<{success:boolean,message:string}>{
        try {
            const {success,passwd} = await this.HASH({passwd:data.newPass})

            if(success){
                const r = await this.Reset({
                    email:data.email,
                    newPasswd:passwd!
                })
                return{
                    success:r.success,
                    message:r.message
                }
            }else{
                return{
                    success:false,
                    message:"an error while changing your pass try again later"
                }
            }
        } catch (error) {
            return{
                success:false,
                message:"an error while changing your pass try again later"
            }
        }
    }

    async CREATE_USER(data:{email:string,name:string,password:string}):Promise<{message:string,success:boolean}>{
        try {
            const id =  uuid() //
            const {success,passwd} = await this.HASH({
                passwd:data.password
            })

            if(success && passwd && id){
                const response = await this.add({
                    id:id,
                    email:data.email,
                    name:data.name,
                    password:passwd!
                })

                return{
                    message:response.message,
                    success:response.success
                }
            }else{
                return{
                    success:false,
                    message:"an error while creating your account try again later"
                }
            }
        } catch (error) {
            return{
                success:false,
                message:"an error while creating user try again later"
            }
        }
    }

    async LOG_USER({email,password}:{email:string,password:string}):Promise<{success:boolean,data?:QueryResult,message?:string}>{
        try {
            const data = await this.verify({
                email
            })

            if(data.success && data.data && data.data.rows.length > 0 ){
                const rs = await this.DECRYPT({
                    hash:data.data.rows[0].passwd,
                    passwd:password
                })

                if(rs){
                    //more code kkkk
                    const ALL = await this.RELATIONSHIP_FIRST_LOGIN_ALL_DATA({email})

                    if(ALL.success && ALL.data && ALL.data.rows.length > 0){
                        return {
                            success:true,
                            data:ALL.data
                        }
                    }else{
                        return{
                            message:ALL.message,
                            success:false
                        }
                    }
                    
                }else{
                    return{
                        success:false,
                        message:"Invalid Email Or Password !!"
                    }
                }
            }else{
                return{
                    success:data.success,
                    message:data.message
                }
            }
        } catch (error) {
            return{
                success:false,
                message:"Invalid credential, provide all fields"
            }
        }
    }

    async POST_ADD({author,title,image}:{title:string,author:string,image?:string}):Promise<{message:string,success:boolean}>{
        try {
            const id = uuid()
            const {message,success} = await this.addPost({
                id,
                title,
                author,
                image
            })
            return{
                success,
                message
            }
        } catch (error) {
            return{
                success:false,
                message:"we couldn't add that post !!"
            }
        }
    }
}