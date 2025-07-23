import multer from 'multer'
import { extname } from 'path'
import { v4 as uuid } from "uuid";

export const IMAGE = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/')
    },
    filename: (req, file, cb) => {
        const unique =  Date.now() + '-' + Math.round(Math.random() * 1E9) * 123;
        const archive =`${uuid()}-${unique}.${extname(file.originalname)}`
        console.log({
            name:archive,
            original :file.originalname
        })
        
        cb(null, archive);
    }
})