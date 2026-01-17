import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductosModule } from './productos/productos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DireccionesModule } from './direcciones/direcciones.module';
import { CategoriasModule } from './categorias/categorias.module';
import { RolesModule } from './roles/roles.module';
import { TransaccionsModule } from './transaccions/transaccions.module';
import { CuponesModule } from './cupones/cupones.module';
import { UploadImageModule } from './upload-image/upload-image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject: [ConfigService]
    }),
    ProductosModule,
    UsuariosModule,
    DireccionesModule,
    CategoriasModule,
    RolesModule,
    TransaccionsModule,
    CuponesModule,
    UploadImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
