import nodemailer from "nodemailer"

export const sendEmail = async (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: `"No Reply" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        text,
    };
    await transporter.sendMail(mailOptions);
}