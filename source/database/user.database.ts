import { QueryResult } from "pg";
import { db } from "./pool";
import {v4 as uuid} from 'uuid'

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
            email VARCHAR(150) UNIQUE,
            PRIMARY KEY(email),
            passwd VARCHAR(200) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
            )`

            const post = `
            CREATE TABLE IF NOT EXISTS post_user(
            id VARCHAR(200) PRIMARY KEY,
            description VARCHAR(100) NOT NULL,
            imagepost VARCHAR(255) ,
            tag VARCHAR(255) NOT NULL,
            likes INTEGER,
            created_at TIMESTAMP DEFAULT NOW(),
            author VARCHAR(100),
            FOREIGN KEY (author) REFERENCES user_data(email) ON DELETE  CASCADE ON UPDATE CASCADE )
            `

            const comment = `
            CREATE TABLE IF NOT EXISTS comment(
            id VARCHAR(200) PRIMARY KEY,
            commenter VARCHAR(100) NOT NULL,
            comment VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            post_id VARCHAR(200),
            FOREIGN KEY (post_id) REFERENCES post_user (id) ON DELETE  CASCADE)`

            await database.query(q)
            await database.query(post)
            await database.query(comment)
        } catch (error) {
            console.log("an error in creating db !!" )  //output error.message : to show the issue   
        }finally{
            database.release();
        }
    }

    async addPost(data:{id:string,title:string,author:string,image?:string,tag:string}):Promise<{message:string,success:boolean}>{
        const database = await db.connect()
        try {
            console.log(data)
            if(data && data.image && data.image.trim() !== ""){
                const id = uuid()
                const post_query = `INSERT INTO post_user(id,description,author,imagepost,likes,tag,created_at) VALUES($1,$2,$3,$4,$5,$6,NOW())`
                //  id   | commenter | post_id |           comment            |         created_at              
                const response = await database.query(post_query,[data.id,data.title,data.author,data.image,0,data.tag])

                if(response){
                    return {message:"post added successfully",success:true}
                }else{
                    return {message:"post not added",success:false}
                }

            }else{
                const post_text = `INSERT INTO post_user(id,description,author,likes,tag,created_at) VALUES($1,$2,$3,$4,$5,NOW())`

                const response = await database.query(post_text,[data.id,data.title,data.author,0,data.tag])


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
    } //with prom *

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

    async get_a_post_by_id(id:string){
        const database = await db.connect()
        try {
            const get_query = `SELECT * FROM post_user INNER JOIN comment ON comment.post_id = post_user.id WHERE post_user.id = $1 ;`
            const get_query_all = `SELECT * FROM post_user INNER JOIN comment ON comment.post_id = post_user.id;`

            if(id === "all"){
                const response = await database.query(get_query_all)

                if(response.rows && response.rows.length > 0){
                    return{
                        success:true,
                        data:response.rows
                    }
                }else{
                    return{
                        success:false,
                        message:"no post founded by this id "
                    }
                }
            }else{
                const response = await database.query(get_query,[id])
                if(response.rows && response.rows.length > 0){
                    return{
                        success:true,
                        data:response.rows
                    }
                }else{
                    return{
                        success:false,
                        message:"no post founded by this id "
                    }
                }

            }
            
        } catch (error) {
            return{
                success:false,
                message:"no post founded by this id !!"
            }
        }
    }

    async d_post(id:string,author:string){
        const database = await db.connect()
        try{
            const q = `DELETE FROM comment WHERE post_id = $1;`
            const delete_query=`DELETE  FROM post_user  WHERE post_user.id = $1 AND post_user.author = $2 RETURNING imagepost;` //
            await database.query(q,[id])
            const response = await database.query(delete_query,[id,author])



            if(response.rowCount && response.rowCount > 0){
                return {
                    success:true,
                    message:"post deleted successfully",
                    image:response.rows[0].imagepost
                }

            }else{
                return{
                    success:false,
                    message:"an error occurred in process of deleting thi post"
                }
            }
        }catch(error){
            return{
                success:false,
                message:"an error while deleting database !!"
            }
        }
    }

    //Give Like.....and add comment
    async addComment(data:{comment:string,commenter:string,post_id:string}){
        const database = await db.connect()

        try {
            const id = uuid()
            const c_query = `INSERT INTO comment(id,commenter,comment,post_id,created_at) VALUES($1,$2,$3,$4,NOW())`
            const response = await database.query(c_query,[id,data.commenter,data.comment,data.post_id])

            if(response && response.rowCount && response.rowCount > 0){
                return{message:'comment added successfully',success:true}
            }else{
                return{message:'Post not found',success:false}
            }
        } catch (error) {
            return {message:"post not found",success:false}
        }
    }


    async addLike(data:{post_id:string}){
        const database = await db.connect()

        try {
            //firstPart
            const r = await this.get_a_post_by_id(data.post_id)

            if(r.success && r.data){
                const like = r.data[0].likes + 1
                //secondPart
                const c_query = `UPDATE post_user SET likes = $1 WHERE id = $2`
                const response = await database.query(c_query,[like,data.post_id])
                
                if(response && response.rowCount && response.rowCount > 0){
                    return{message:'OK',success:true}
                }else{
                    return{message:'Post not found',success:false}
                }
            }else{
                return{message:'Post not found',success:false}
            }

        } catch (error) {
            return {message:"an error",success:false}
        }
    }
    
}