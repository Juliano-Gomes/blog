import { Account } from './routes/createAccount'
import { POST } from './routes/createPost'
import { deletePost } from './routes/deletePost'
import { ForgotPassRouter } from './routes/forgetPass'
import { getAllPost } from './routes/getAllPost'
import { getPost } from './routes/getPost'
import { LOGGER } from './routes/loginAccount'
import { ResetPassRouter } from './routes/resetPass'
import {redis} from './services/redis.config'
import Express from 'express'
import logger from 'pino'
//
const App = Express()
//
App.use(Express.json())
App.use(Express.urlencoded({extended: true}))
//Logger Middleware
App.use((request,response,next)=>{
    logger().info({
        method: request.method,
        url: request.url,
        body: request.body,
        query: request.query,
    })
    next()
})

// 
App.use(ForgotPassRouter)
App.use(ResetPassRouter)
App.use(Account)
App.use(POST)
App.use(LOGGER)
App.use(getPost)
App.use(deletePost)
App.use(getAllPost)
//
const PORT = process.env.PORT
const init = async()=>{ 
    await redis.connect()
    App.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

init().catch(err => {
    console.error('Failed to initialize the server:', err)
})