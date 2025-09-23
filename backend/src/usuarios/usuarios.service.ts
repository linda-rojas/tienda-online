import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';
import { Direccione } from 'src/direcciones/entities/direccione.entity';
import { ValidationService } from 'src/services/validation.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Direccione) private readonly direccioneRepository: Repository<Direccione>,
    @Inject(ValidationService) private readonly validationService: ValidationService,
  ) { }



  // Crear usuario con direcciones
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { roleId, direcciones, ...userData } = createUsuarioDto;

    await this.validationService.existsOrFail(
      this.usuarioRepository,
      'correo',
      createUsuarioDto.correo,
      'El correo ingresado ya está en uso'
    );

    // el rol existe ?
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Rol con ID ${roleId} no encontrado`);
    }

    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUsuarioDto.contraseña, salt);

    //  nuevo usuario con la contraseña encriptada
    const newUser = this.usuarioRepository.create({
      ...userData,
      contraseña: hashedPassword,
      role,
    });

    // Guardar el usuario
    const savedUser = await this.usuarioRepository.save(newUser);

    if (direcciones && direcciones.length > 0) {
      const direccionesEntities = direcciones.map(dto =>
        this.direccioneRepository.create({
          ...dto,
          usuario: savedUser,
        }),
      );
      await this.direccioneRepository.save(direccionesEntities);
    }

    return savedUser;
  }


  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: ['role'],
    });
  }


  async findOne(id: number): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['role', 'direcciones'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const user = await this.findOne(id);

    if (updateUsuarioDto.correo && updateUsuarioDto.correo !== user.correo) {
      // console.log(updateProductoDto.nombre)
      await this.validationService.existsOrFail(
        this.usuarioRepository,
        'correo',
        updateUsuarioDto.correo,
        'El correo ingresado ya está en uso'
      );

    }

    const usuario = await this.usuarioRepository.preload({
      id: id,
      ...updateUsuarioDto
    });

    if (!usuario) {
      throw new NotFoundException(`El usuario con el id: ${id} no fue encontrado`)
    }
    return await this.usuarioRepository.save(usuario);
  }


  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usuarioRepository.remove(user);
  }
}
