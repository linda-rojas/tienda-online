import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Role } from '../roles/entities/role.entity';
import { ValidationService } from 'src/services/validation.service';
import { Direccione } from 'src/direcciones/entities/direccione.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PasswordResetService } from './services/password-reset.service';
import { CustomMailerModule } from 'src/mailer/mailer.module';
import { ProductosModule } from 'src/productos/productos.module';
import { Producto } from 'src/productos/entities/producto.entity';
import { Transaccion } from 'src/transaccions/entities/transaccion.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Usuario, Role, Direccione, Producto, Transaccion]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      })
    }),
    CustomMailerModule,
  ],
  controllers: [UsuariosController],
  providers: [
    UsuariosService,
    ValidationService,
    JwtStrategy,
    PasswordResetService
  ],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule
  ]
})
export class UsuariosModule { }

