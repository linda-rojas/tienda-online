import { Controller, Post, Param, Body, Logger, Get } from '@nestjs/common';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { UploadImageService } from 'src/upload-image/upload-image.service';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { UploadImagesDto } from './upload-images.dto';

@Controller('upload-images')
export class UploadImageController {
  constructor(
    private readonly uploadImageService: UploadImageService,
  ) { }

  @Post(':productoId')
  @FormDataRequest({ storage: MemoryStoredFile }) // almacenamiento en memoria
  async uploadImages(
    @Param('productoId', IdValidationPipe) productoId: number,
    @Body() uploadDto: UploadImagesDto,
  ) {
    // return 'hello'
    return this.uploadImageService.uploadFiles(uploadDto.images, productoId);
  }

  // Método para obtener las imágenes de un producto (GET)
  @Get(':productoId')
  async getImages(
    @Param('productoId', IdValidationPipe) productoId: number,
  ) {
    return this.uploadImageService.getImagesByProductId(productoId);
  }
}
