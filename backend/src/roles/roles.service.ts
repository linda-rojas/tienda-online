import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { ValidationService } from 'src/services/validation.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly RolRepository: Repository<Role>,
    @Inject(ValidationService) private readonly validationService: ValidationService
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    await this.validationService.existsOrFail(
      this.RolRepository,
      'nombre',
      createRoleDto.nombre,
      'El nombre del rol ya está en uso'
    );

    return this.RolRepository.save(createRoleDto);
  }

  findAll() {
    return this.RolRepository.find();
  }

  async findOne(id: number) {
    const rol = await this.RolRepository.findOneBy({ id })
    // si no existe ese id retorna:
    if (!rol) {
      throw new NotFoundException('El rol no existe')
    }
    return rol;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const rol = await this.findOne(id)

    if (updateRoleDto.nombre && updateRoleDto.nombre !== rol.nombre) {
      await this.validationService.existsOrFail(
        this.RolRepository,
        'nombre',
        updateRoleDto.nombre,
        'El nombre del rol ya está en uso'
      );
    }

    const producto = await this.RolRepository.preload({
      id: id,
      ...updateRoleDto
    });

    if (!producto) {
      throw new NotFoundException(`El rol con el id: ${id} no fue encontrado`)
    }
    return await this.RolRepository.save(rol);
  }

  async remove(id: number) {
    const rol = await this.findOne(id)
    await this.RolRepository.remove(rol)
    return 'rol eliminado';
  }
}
