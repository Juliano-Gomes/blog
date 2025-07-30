import multer from 'multer'
import { extname, join, resolve } from 'path'
import { v4 as uuid } from "uuid";


const dest = join(resolve(__dirname,"..","images"))

export const IMAGE = multer.diskStorage({
    destination:dest,
    filename: (req, file, cb) => {
        const unique =  Date.now() + '-' + Math.round(Math.random() * 1E9) * 123;
        const archive =`${uuid()}-${unique}${extname(file.originalname)}`
        
        cb(null, archive);
    }
})