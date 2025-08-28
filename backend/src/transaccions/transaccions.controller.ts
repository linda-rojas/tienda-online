import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransaccionsService } from './transaccions.service';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';
import { IdValidationPipe } from 'src/common/pipes/id-validation/id-validation.pipe';

@Controller('transacciones')
export class TransaccionsController {
  constructor(private readonly transaccionsService: TransaccionsService) {}

  @Post()
  create(@Body() createTransaccionDto: CreateTransaccionDto) {
    return this.transaccionsService.create(createTransaccionDto);
  }

  @Get()
  findAll(@Query('transacciondate') transacciondate: string) {
    return this.transaccionsService.findAll(transacciondate);
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.transaccionsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.transaccionsService.remove(+id);
  }
}
