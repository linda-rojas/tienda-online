import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly RolRepository : Repository<Role>
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return this.RolRepository.save(createRoleDto);
    
  }

  findAll() {
    return this.RolRepository.find();
  }

  async findOne(id: number) {
    const rol = await this.RolRepository.findOneBy({id})
        // si no existe ese id retorna:
        if (!rol) {
          throw new NotFoundException('El rol no existe')
        }
        return rol;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const rol = await this.findOne(id)
    rol.nombre = updateRoleDto.nombre
    return await this.RolRepository.save(rol);
  }

  async remove(id: number) {
    const rol = await this.findOne(id)
    await this.RolRepository.remove(rol)
    return 'rol eliminado';
  }
}
