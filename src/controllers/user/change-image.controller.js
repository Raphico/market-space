import stream from "node:stream";
import { v2 as cloudinary } from "cloudinary";
import { eq } from "drizzle-orm";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { logger } from "../../loggers/winston.logger.js";
import "../../services/cloudinary.service.js";

export const changeImage = asyncHandler(
    async function changeImage(request, response) {
        const readable = stream.Readable.from(request.file.buffer);

        const uploadResult = await new Promise((resolve, reject) => {
            const uploadReadable = cloudinary.uploader.upload_stream(
                (error, uploadResult) => {
                    return uploadResult ? resolve(uploadResult) : reject(error);
                }
            );

            readable.pipe(uploadReadable);
        });

        const optimizedUrl = cloudinary.url(uploadResult.public_id, {
            fetch_format: "auto",
            quality: "auto",
        });

        try {
            const user = await db
                .update(users)
                .set({
                    image: optimizedUrl,
                })
                .where(eq(users.id, request.user.id))
                .returning({ image: users.image });

            response.status(200).json(
                new ApiResponse({
                    data: user,
                    message: "image updated successfully",
                    status: "ok",
                })
            );
        } catch (error) {
            logger.error(error?.message);

            if (uploadResult && uploadResult.public_id) {
                await cloudinary.uploader.destroy(uploadResult.public_id);
            }

            throw new ApiError({
                message: "failed to update image",
                statusCode: 500,
            });
        }
    }
);