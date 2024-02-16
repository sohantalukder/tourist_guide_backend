import Joi from "joi";
import "dotenv/config";

const envValidation = Joi.object()
    .keys({
        NODE_ENV: Joi.string()
            .valid("development", "production", "local")
            .required(),
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().default("localhost"),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required().description("JWT secret key"),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
            .default(30)
            .description("minutes after which access tokens expire"),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
            .default(30)
            .description("days after which refresh tokens expire"),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description("minutes after which reset password token expires"),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description("minutes after which verify email token expires"),
    })
    .unknown();

const { value: envVar, error } = envValidation
    .prefs({ errors: { label: "key" } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
    nodeEnv: envVar.NODE_ENV,
    appIdentifier: envVar.APP_IDENTIFIER,
    port: envVar.PORT,
    dbHost: envVar.DB_HOST,
    dbUser: envVar.DB_USER,
    dbPass: envVar.DB_PASSWORD,
    dbName: envVar.DB_NAME,
    cloudinary: {
        cloud_name: envVar.CLOUDINARY_CLIENT_NAME,
        api_key: envVar.CLOUDNINARY_CLIENT_API,
        api_secret: envVar.CLOUNDINARY_PASSWROD_SECRET,
    },
    smtp: {
        host: envVar.SMTP_SERVER,
        port: envVar.SMTP_PORT,
        auth: {
            user: envVar.SMTP_AUTH_EMAIL,
            pass: envVar.SMTP_AUTH_PASSWORD,
        },
    },
    jwt: {
        secret: envVar.JWT_SECRET,
        accessExpirationMinutes: envVar.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVar.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes:
            envVar.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes:
            envVar.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
};
