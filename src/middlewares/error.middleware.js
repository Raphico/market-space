import { ApiError } from "../utils/api-error.js";
import { logger } from "../loggers/winston.logger.js";
import { env } from "../config.js";

export function errorHandler(error, request, response, next) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const errorMessage =
        error instanceof ApiError
            ? error.message
            : "something went wrong. Please, try again later";

    logger.error(errorMessage);

    response.status(statusCode).json({
        data: null,
        status: "error",
        message: errorMessage,
        ...(env.NODE_ENV === "production" ? {} : { stack: error.stack }),
    });
}
