import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DireccionesService } from './direcciones.service';
import { CreateDireccioneDto } from './dto/create-direccione.dto';
import { UpdateDireccioneDto } from './dto/update-direccione.dto';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { PhoneValidationPipe } from '../common/pipes/phone-validation/phone-validation.pipe';

@Controller('direcciones')
export class DireccionesController {
  constructor(private readonly direccionesService: DireccionesService) { }

  @Post()
  create(@Body() createDireccioneDto: CreateDireccioneDto, @Query('userId') userId: number) {
    return this.direccionesService.create(createDireccioneDto, userId);
  }


  @Get()
  findAll() {
    return this.direccionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: number) {
    return this.direccionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', IdValidationPipe) id: number, @Body() updateDireccioneDto: UpdateDireccioneDto) {
    return this.direccionesService.update(+id, updateDireccioneDto);
  }

  @Delete(':id')
  remove(@Param('id', IdValidationPipe) id: number) {
    return this.direccionesService.remove(+id);
  }

  @Get('validation-phone/:celular')
  validationPhone(@Param('celular', PhoneValidationPipe) celular: string) {
    return `Número válido: ${celular}`;
  }
}
