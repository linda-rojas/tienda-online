import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { PhoneValidationPipe } from '../common/pipes/phone-validation/phone-validation.pipe';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/usuarios/decorators/get-user.decorator';
import { Usuario } from './entities/usuario.entity';
import { RawHeaders } from 'src/common/decorators/raw-headers.decorator';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { RequestPasswordResetDto } from 'src/mailer/dto/request-password-reset.dto';
import { ResetPasswordDto } from 'src/mailer/dto/reset-password.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }


  @Delete(':id')
  remove(@Param('id', IdValidationPipe) id: number) {
    return this.usuariosService.remove(id);
  }

  // verificar correo
  @Get('check-email/:correo')
  async checkEmail(@Param('correo') correo: string) {
    return this.usuariosService.checkEmail(correo);
  }

  @Get('validation-phone/:celular')
  validationPhone(@Param('celular', PhoneValidationPipe) celular: string) {
    return `Número válido: ${celular}`;
  }

  @Post('crear-admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('administrador')
  createAdmin(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.createAdmin(dto);
  }

  @Post('solicitud-de-restablecimiento-de-contrasena')
  async requestPasswordReset(@Body() body: RequestPasswordResetDto) {
    return this.usuariosService.requestPasswordReset(body.correo);
  }

  @Patch('restablecer-contrasena')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usuariosService.resetPassword(resetPasswordDto.token, resetPasswordDto.nuevaContrasena);
  }


  @Post('login')
  @HttpCode(HttpStatus.OK)
  loginUser(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.usuariosService.login(loginUsuarioDto);
  }

  @Get('administrador')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('administrador')
  adminOnlyRoute(@GetUser() user: Usuario) {
    return {
      message: 'Acceso permitido solo para administradores',
      user
    };
  }

  @Get('privado')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: Usuario,
    @GetUser('correo') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ) {
    return {
      ok: true,
      message: 'Tienes acceso a la ruta privada',
      user,
      userEmail,
      rawHeaders
    };
  }

  @Patch(':id')
  update(@Param('id', IdValidationPipe) id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: number) {
    return this.usuariosService.findOne(id);
  }
}