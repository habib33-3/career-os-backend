import { Injectable } from "@nestjs/common";

import type { UploadApiResponse } from "cloudinary";

import cloudinary from "./cloudinary";

@Injectable()
export class UploadFileService {
    private async uploadBuffer(
        buffer: Buffer,
        folder: string
    ): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder },
                (error, result) => {
                    if (error || !result) {
                        reject(error);
                        return;
                    }

                    resolve(result);
                }
            );

            stream.end(buffer);
        });
    }

    async uploadFile(file: Express.Multer.File, folder = "uploads") {
        const result = await this.uploadBuffer(file.buffer, folder);

        return {
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type,
        };
    }
}
