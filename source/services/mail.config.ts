import {createTransport} from 'nodemailer'

export const Email = createTransport({
    host: "smtp.gmail.com",
    port:465,
    secure: true, 
    auth: {
        user: process.env.USER,
        pass: process.env.USER_PASS
    }
})