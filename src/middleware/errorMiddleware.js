import { response } from "../utility/generateResponse.js";

const notFound = (req, res, next) => {
    return res
        .status(404)
        .json(response({ code: 404, message: "Not found this URL!" }));
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    return res.status(statusCode).json(
        response({
            code: statusCode,
            message: err.message,
            records: {
                stack: process.env.NODE_ENV === "production" ? null : err.stack,
            },
        })
    );
};

export { notFound, errorHandler };
