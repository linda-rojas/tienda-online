import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { Producto } from 'src/productos/entities/producto.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { ProductSeeder } from './seeders/product.seeder';
import { CategorySeeder } from './seeders/category.seeder';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true
      }),
      TypeOrmModule.forRootAsync({
        useFactory: typeOrmConfig,
        inject: [ConfigService]
      }),
      TypeOrmModule.forFeature([Producto, Categoria]),
    ],
  providers: [
    SeederService,
    ProductSeeder,
    CategorySeeder,
  ], 
  exports: [SeederService],
})
export class SeederModule {}
