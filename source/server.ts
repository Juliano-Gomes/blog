import { ForgotPassRouter } from './routes/forgetPass'
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