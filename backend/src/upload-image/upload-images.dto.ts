// src/upload-image/dto/upload-image.dto.ts
import {
  IsArray, ValidateNested, IsString, IsNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { UploadImageRequest } from './upload-image-request.interface';

class ImageItemDto implements UploadImageRequest {
  @IsFile()
  @MaxFileSize(5 * 1024 * 1024) // 5MB
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp'])
  file: MemoryStoredFile;

  @IsString()
  @IsNotEmpty()
  type: string;
}

export class UploadImagesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageItemDto)
  images: ImageItemDto[];
}
