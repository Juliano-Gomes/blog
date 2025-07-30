import {createClient} from 'redis'

export const redis = createClient()
//{url:process.env.REDIS_URL_CONNECTION_E}
redis.on('error', err => console.log('Redis Client Error', err));