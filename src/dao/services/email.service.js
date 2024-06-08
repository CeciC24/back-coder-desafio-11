import nodemailer from 'nodemailer'
import config from '../../config/environment.config.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.emailUser,
        pass: config.emailPassword,
    }
})

export const sendTestEmail = () => {
    return transporter.sendMail({
        from: 'Coder Tests <' + config.emailUser + '>',
        to: 'ceciliacc3@gmail.com',
        subject: 'Correo de prueba',
        html: `
        <div>
            <h1>Test</h1>
        </div>
        `,
        attachments: []
    })
}