import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { IdValidationPipe } from 'src/common/pipes/id-validation/id-validation.pipe';
import { PhoneValidationPipe } from 'src/common/pipes/phone-validation/phone-validation.pipe';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }


  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', IdValidationPipe) id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.usuariosService.remove(+id);
  }

  @Get('validation-phone/:celular')
  validationPhone(@Param('celular', PhoneValidationPipe) celular: string) {
    return `Número válido: ${celular}`;
  }
}
