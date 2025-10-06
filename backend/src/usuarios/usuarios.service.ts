import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';
import { Direccione } from 'src/direcciones/entities/direccione.entity';
import { ValidationService } from 'src/services/validation.service';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PasswordResetService } from './services/password-reset.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Direccione) private readonly direccioneRepository: Repository<Direccione>,
    @Inject(ValidationService) private readonly validationService: ValidationService,
    private readonly jwtService: JwtService,
    private readonly passwordResetService: PasswordResetService
  ) { }



  // Crear usuario con direcciones
  async create(createUsuarioDto: CreateUsuarioDto): Promise<{ user: Usuario, token: string }> {
    return this.createUserWithRole(createUsuarioDto, 'usuario');
  }

  async createAdmin(createUsuarioDto: CreateUsuarioDto): Promise<{ user: Usuario, token: string }> {
    return this.createUserWithRole(createUsuarioDto, 'administrador');
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

  async login(loginUsuarioDto: LoginUsuarioDto) {
    const { correo, contraseña } = loginUsuarioDto
    const user = await this.usuarioRepository.findOne({
      where: { correo },
      select: { correo: true, contraseña: true, id: true },
      relations: { role: true }
    })

    if (!user) {
      throw new UnauthorizedException(`Usuario con correo ${correo} no encontrado`);
    }

    if (!bcrypt.compareSync(contraseña, user.contraseña)) {
      throw new UnauthorizedException(`Contraseña incorrecta ${contraseña}`);
    }
    return {
      ...user,
      token: this.getJwtToken({
        id: user.id,
        role: user.role.nombre
      })
    };
  }

  private getJwtToken(payload: JwtPayload,) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private async createUserWithRole(
    dto: CreateUsuarioDto,
    roleName: string
  ): Promise<{ user: Usuario, token: string }> {
    const { direcciones, ...userData } = dto;

    await this.validationService.existsOrFail(
      this.usuarioRepository,
      'correo',
      dto.correo,
      'El correo ingresado ya está en uso'
    );

    const role = await this.roleRepository.findOneBy({ nombre: roleName });
    if (!role) {
      throw new NotFoundException(`El rol "${roleName}" no existe`);
    }

    const hashedPassword = await bcrypt.hash(dto.contraseña, 10);

    const newUser = this.usuarioRepository.create({
      ...userData,
      contraseña: hashedPassword,
      role,
    });

    const savedUser = await this.usuarioRepository.save(newUser);

    if (direcciones?.length > 0) {
      const direccionesEntities = direcciones.map(dto =>
        this.direccioneRepository.create({ ...dto, usuario: savedUser })
      );
      await this.direccioneRepository.save(direccionesEntities);
    }

    const token = this.getJwtToken({ id: savedUser.id, role: role.nombre });

    return { user: savedUser, token };
  }

  async requestPasswordReset(correo: string) {
    return this.passwordResetService.requestReset(correo);
  }

  async resetPassword(token: string, nuevaContraseña: string) {
    return this.passwordResetService.resetPassword(token, nuevaContraseña);
  }
}
