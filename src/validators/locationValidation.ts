import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import ApiError from "@helpers/ApiError.js";
import httpStatus from "http-status";

export default class locationValidator {
    async divisionCreateValidator(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        // create schema object
        const schema = Joi.object({
            divisionName: Joi.string().min(3).max(15).required,
            divisionCode: Joi.number().min(1).required(),
            geoCode: Joi.number().max(5).required(),
            isoCode: Joi.string().max(10).required,
        });
        // schema options
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true, // remove unknown props
        };

        // validate request body against schema
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            // on fail return comma separated errors
            const errorMessage = error.details
                .map((details) => details.message)
                .join(", ");
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
        }
    }
}
