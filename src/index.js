import "dotenv/config";
import { logger } from "./loggers/winston.logger.js";
import { app } from "./app.js";
import "./utils/uncaught-errors.js";

app.listen(process.env.PORT, () =>
    logger.info(`Server is running on port ${process.env.PORT}`)
);
