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
// import { PasswordResetService } from './services/password-reset.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Usuario, Role, Direccione]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      })
    })
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: '1h' },
    // })
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, ValidationService, JwtStrategy],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class UsuariosModule { }

