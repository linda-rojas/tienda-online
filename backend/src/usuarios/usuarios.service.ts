import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsuariosService {
  constructor(
      @InjectRepository(Usuario) private readonly usuarioRepository : Repository<Usuario>,
      @InjectRepository(Role) private readonly RoleRepository : Repository<Role>,
      
    ) {}


  async create(createUsuarioDto: CreateUsuarioDto) {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.contraseña, 10);
    createUsuarioDto.contraseña = hashedPassword;
    return this.usuarioRepository.save(createUsuarioDto);
  }

  findAll() {
    return this.usuarioRepository.find();
  }


  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOneBy({id})
        // si no existe ese id retorna:
        if (!usuario) {
          throw new NotFoundException('El usuario no existe')
        }
        return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id)
    usuario.nombre = updateUsuarioDto.nombre
    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.findOne(id)
    await this.usuarioRepository.remove(usuario)
    return 'usuario eliminado';
  }
}
