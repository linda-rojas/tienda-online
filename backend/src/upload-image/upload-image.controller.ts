import { Controller, Post, Param, Body, Get, BadRequestException, Delete, Patch } from '@nestjs/common';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { UploadImageService } from 'src/upload-image/upload-image.service';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { UploadImagesDto } from './dto/upload-images.dto';
import { ChangeImageTypeDto } from './dto/change-image-type.dto';


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
    if (!uploadDto.images || uploadDto.images.length === 0) {
      throw new BadRequestException(
        'Debes enviar images[] con file y type. Ej: images[0].file, images[0].type',
      );
    }

    return this.uploadImageService.uploadFiles(uploadDto.images, productoId);
  }

  // Método para obtener las imágenes de un producto (GET)
  @Get(':productoId')
  async getImages(
    @Param('productoId', IdValidationPipe) productoId: number,
  ) {
    return this.uploadImageService.getImagesByProductId(productoId);
  }

  // CAMBIAR TYPE (primary/secondary/gallery)
  @Patch(':productoId/:imageId/type')
  async changeImageType(
    @Param('productoId', IdValidationPipe) productoId: number,
    @Param('imageId', IdValidationPipe) imageId: number,
    @Body() dto: ChangeImageTypeDto,
  ) {
    return this.uploadImageService.changeImageType(productoId, imageId, dto.type);
  }

  @Delete(':productoId/:imageId')
  async deleteImage(
    @Param('productoId', IdValidationPipe) productoId: number,
    @Param('imageId', IdValidationPipe) imageId: number,
  ) {
    return this.uploadImageService.deleteImage(productoId, imageId);
  }
}
