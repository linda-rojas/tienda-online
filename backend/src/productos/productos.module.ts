import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { ValidationService } from 'src/services/validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Categoria])],
  exports: [TypeOrmModule],
  controllers: [ProductosController],
  providers: [ProductosService, ValidationService],
})
export class ProductosModule { }
