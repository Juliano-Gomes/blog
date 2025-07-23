import { QueryResult } from "pg";
import { db } from "./pool";

export class user_schema{
    constructor(){
        this.table()
    }
    
    private async table() {
        const database = await db.connect();
        try {
            const q = `CREATE TABLE IF NOT EXISTS user_data(
            id VARCHAR(200),
            name VARCHAR(100) NOT NULL ,
            email VARCHAR(150) NOT NULL UNIQUE,
            PRIMARY KEY(email),
            passwd VARCHAR(200) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
            )`

            const post = `
            CREATE TABLE IF NOT EXISTS post_user(
            id VARCHAR(200) PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            author VARCHAR(100) NOT NULL ,
            FOREIGN KEY (author) REFERENCES user_data(email) ,
            imagepost VARCHAR(255),
            created_at TIMESTAMP DEFAULT NOW())
            `

            const comment = `
            CREATE TABLE IF NOT EXISTS comment(
            id VARCHAR(200) PRIMARY KEY,
            commenter VARCHAR(100) NOT NULL,
            post_id VARCHAR(200) NOT NULL ,
            FOREIGN KEY (post_id) REFERENCES post_user (id),
            comment VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW())`

            await database.query(q)
            await database.query(post)
            await database.query(comment)
        } catch (error) {
            console.log("an error in creating db !!")  //output error.message : to show the issue   
        }finally{
            database.release();
        }
    }

    async addPost(data:{id:string,title:string,author:string,image?:string}):Promise<{message:string,success:boolean}>{
        const database = await db.connect()
        try {
            if(data.image && data.image.trim() !== ""){
                const post_query = `INSERT INTO post_user(id,title,author,imagepost,created_at) VALUES($1,$2,$3,$4,NOW())`
    
                const response = await database.query(post_query,[data.id,data.title,data.author,data.image])

                if(response){
                    return {message:"post added successfully",success:true}
                }else{
                    return {message:"post not added",success:false}
                }

            }else{
                const post_text = `INSERT INTO post_user(id,title,author,created_at) VALUES($1,$2,$3,NOW())`

                const response = await database.query(post_text,[data.id,data.title,data.author])

                if(response){
                    return {message:"post added successfully",success:true}
                }else{
                    return {message:"post not added",success:false}
                }
            }
        } catch (error) {
            console.log({
                error:true,
                //message:error.message
            })
            return{
                success:false,
                message:"an error while adding the data"
            }
        }finally{
            database.release();
        }
    }

    async Reset(data:{email:string,newPasswd:string}):Promise<{success:boolean,message:string}>{
        const database = await db.connect();
        try {
            const reset_query = `UPDATE user_data SET passwd = $1 WHERE email = $2 ;`

            const response = await database.query(reset_query,[data.newPasswd,data.email])

            if(response){
                return{
                    success:true,
                    message:"password has been reset successfully"
                }
            }else{
                return{
                    success:false,
                    message:"error in database"
                }
            }
        } catch (error) {
            return{
                success:false,
                message:"error in database !!"
            }
        }finally{
            database.release();
        }
    }

    async add(data:{email:string,id:string,name:string,password:string}):Promise<{message:string,success:boolean}>{
        const database =await db.connect()
        try {
            const create_query = `INSERT INTO user_data(id,name,email,passwd,created_at) VALUES($1,$2,$3,$4,NOW());`
            const response = await database.query(create_query,[data.id,data.name,data.email,data.password])

            if(response){
                return{
                    success:true,
                    message:"user has been created successfully"
                }
            }else{
                return{
                    success:false,
                    message:"error in database"
                }
            }
        } catch (error) {
            return{
                success:false,
                message:"error in database !!"
            }
        }finally{
            database.release();
        }
    }

    async verify({email}:{email:string}):Promise<{success:boolean,data?:QueryResult,message?:string}>{
        const database = await db.connect()
        try {
            const verify_query = `SELECT * FROM user_data WHERE email = $1;`
            const response = await database.query(verify_query,[email])

            if(response.rows){
                return{
                    data:response,
                    success:true
                }
            }else{
                return{
                    success:false,
                    message:"Invalid email or password"
                }
            }
        } catch (error) {
            return{
                success:false,
                message:"invalid email or password kkk"
            }
        }finally{
            database.release()
        }
    }

    async RELATIONSHIP_FIRST_LOGIN_ALL_DATA({email}:{email:string}):Promise<{success:boolean,data?:QueryResult,message?:string}>{
        const database = await db.connect()

        try {
            const relation_query = `SELECT * FROM user_data INNER JOIN post_user ON post_user.author = user_data.email INNER JOIN comment ON comment.post_id = post_user.id WHERE email = $1;`
            const response = await database.query(relation_query,[email])

            if(response.rows){
                return{
                    success:true,
                    data:response
                }
            }else{
                return{
                    success:false,
                    message:"an error while fetching data !!!" 
                }
            }
        } catch (error) {
            return{
                success:false,
                message:"an error while fetching data !!!"
            }
        }
    }
}