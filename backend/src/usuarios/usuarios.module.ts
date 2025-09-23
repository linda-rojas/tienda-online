import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Role } from '../roles/entities/role.entity';
import { ValidationService } from 'src/services/validation.service';
import { Direccione } from 'src/direcciones/entities/direccione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Role, Direccione])],
  controllers: [UsuariosController],
  providers: [UsuariosService, ValidationService],
})
export class UsuariosModule { }

