import { Injectable, PipeTransform, BadRequestException, Logger } from '@nestjs/common';
import { Express } from 'express';
import { UploadImageRequest } from './interfaces/upload-image-request.interface';

@Injectable()
export class ValidateUploadImageRequestPipe implements PipeTransform {
    transform(uploadImages: UploadImageRequest[], metadata: any) {
        // Verificar que 'files' no sea undefined ni vacío
        if (!uploadImages || uploadImages.length === 0) {
            throw new BadRequestException('No files uploaded.');
        }

        Logger.log(JSON.stringify(uploadImages), 'ValidateUploadImageRequestPipe');

        // Iterar sobre los archivos
        uploadImages.forEach(uploadImage => {
            // Verificar que el archivo tenga la propiedad 'image'
            if (!uploadImage.file) {
                throw new BadRequestException('Missing image in file object.');
            }

            // Validar el tipo de archivo (solo JPEG y PNG por ejemplo)
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(uploadImage.file.mimetype)) {
                throw new BadRequestException(`Invalid file type: ${uploadImage.file.mimetype}. Only JPEG and PNG are allowed.`);
            }

            // Validar el tamaño del archivo (máximo 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (uploadImage.file.size > maxSize) {
                throw new BadRequestException('File size exceeds the limit of 5MB.');
            }

            // Validar el tipo del archivo (campo `type` debe estar presente)
            if (!uploadImage.type || !['profile', 'product', 'other'].includes(uploadImage.type)) {
                throw new BadRequestException(`Invalid type: ${uploadImage.type}. Allowed types are 'profile', 'product', or 'other'.`);
            }
        });

        return uploadImages;
    }
}
