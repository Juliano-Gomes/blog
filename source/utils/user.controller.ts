import { user_schema } from "../database/user.database";
import { compare, genSalt, hash } from "bcrypt";
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
}