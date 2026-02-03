import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    async uploadAvatar(buffer: Buffer, userId: number) {
        // sube con stream (no requiere guardar en disco)
        return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                {
                    folder: 'usuarios/avatars',
                    public_id: `user_${userId}_${Date.now()}`,
                    resource_type: 'image',
                    overwrite: true,
                    transformation: [
                        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                        { quality: 'auto', fetch_format: 'auto' },
                    ],
                },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve({ secure_url: result.secure_url, public_id: result.public_id });
                },
            );

            upload.end(buffer);
        });
    }

    async deleteByPublicId(publicId: string) {
        try {
            if (!publicId) return;
            await cloudinary.uploader.destroy(publicId);
        } catch {
        }
    }
}
