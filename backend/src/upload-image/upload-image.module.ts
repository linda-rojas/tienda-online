import { forwardRef, Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UploadImageProvider } from './upload-image';
import { UploadImageService } from './upload-image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imagen } from 'src/productos/entities/imagenes.entity';
import { UploadImageController } from './upload-image.controller';
import { ProductosModule } from 'src/productos/productos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Imagen]),
    forwardRef(() => ProductosModule),
    NestjsFormDataModule,
  ],
  controllers: [
    UploadImageController,
  ],
  providers: [UploadImageService, UploadImageProvider],
  exports: [UploadImageService, UploadImageProvider]
})
export class UploadImageModule { }
