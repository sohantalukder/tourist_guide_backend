import nodemailer from "nodemailer";
import { config } from "./config.js";
export const transporter = () => nodemailer.createTransport(config.smtp);
