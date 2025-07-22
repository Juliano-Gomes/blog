import { PoolClient } from "pg";
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
            PRIMARY KEY(name),
            email VARCHAR(100) NOT NULL UNIQUE,
            passwd VARCHAR(200) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
            )`

            const post = `
            CREATE TABLE IF NOT EXISTS post_user(
            id VARCHAR(200) PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            author VARCHAR(100) NOT NULL ,
            FOREIGN KEY (author) REFERENCES user_data(name) ,
            created_at TIMESTAMP DEFAULT NOW())
            `

            const comment = `
            CREATE TABLE IF NOT EXISTS comment(
            id VARCHAR(200) PRIMARY KEY,
            author VARCHAR(100) NOT NULL,
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
        }
    }

    async add(data:{email:string,id:string,name:string,password:string}):Promise<{message:string,success:boolean}>{
        const database =await db.connect()
        try {
            const create_query = `INSERT INTO user_data(id,name,email,passwd,created_at) VALUES($1,$2,$3,$4,NOW());`
            const response = await database.query(create_query,[data.id,data.name,data.email,data.password])

            console.log(response)

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
                message:"error in database"
            }
        }
    }
}