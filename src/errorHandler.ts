import {ErrorRequestHandler} from "express-serve-static-core";
import {ZodError} from "zod";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof ZodError) {
        res.status(400).send(error);
    }

    next(error);
}
