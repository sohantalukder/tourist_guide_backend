import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
        user: "tourists.guides2@gmail.com",
        pass: "1KrAdqIWQwzGt3Jp",
    },
});
