import { forwardRef, Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { ValidationService } from 'src/services/validation.service';
import { UploadImageModule } from 'src/upload-image/upload-image.module';
import { Imagen } from './entities/imagenes.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';
// import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Categoria, Imagen]),
    forwardRef(() => UploadImageModule),
    NestjsFormDataModule.config({ autoDeleteFile: true }), // Limpia los archivos temporales
  ],
  exports: [TypeOrmModule, ProductosService],
  controllers: [ProductosController],
  providers: [ProductosService, ValidationService],
})
export class ProductosModule { }
