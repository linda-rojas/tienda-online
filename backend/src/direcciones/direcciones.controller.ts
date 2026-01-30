import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { DireccionesService } from './direcciones.service';
import { CreateDireccioneDto } from './dto/create-direccione.dto';
import { UpdateDireccioneDto } from './dto/update-direccione.dto';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { PhoneValidationPipe } from '../common/pipes/phone-validation/phone-validation.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('direcciones')
export class DireccionesController {
  constructor(private readonly direccionesService: DireccionesService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateDireccioneDto, @Req() req: Request) {
    const userId = (req as any).user?.id;
    return this.direccionesService.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.direccionesService.findAll();
  }

  @Get('validation-phone/:celular')
  validationPhone(@Param('celular', PhoneValidationPipe) celular: string) {
    return `Número válido: ${celular}`;
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

}
