import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { CuponesService } from './cupones.service';
import { CreateCuponeDto } from './dto/create-cupone.dto';
import { UpdateCuponeDto } from './dto/update-cupone.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@Controller('cupones')
export class CuponesController {
  constructor(private readonly cuponesService: CuponesService) {}

  @Post()
  create(@Body() createCuponeDto: CreateCuponeDto) {
    return this.cuponesService.create(createCuponeDto);
  }

  @Get()
  findAll() {
    return this.cuponesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidationPipe) id: string) {
    return this.cuponesService.findOne(+id);
  }

  @Put(':id')
    update(@Param('id', ValidationPipe) id: string, 
    @Body() updateCuponeDto: UpdateCuponeDto
    ) {
    return this.cuponesService.update(+id, updateCuponeDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidationPipe) id: string) {
    return this.cuponesService.remove(+id);
  }

  @Post('/aplicar-cupon')
  @HttpCode(HttpStatus.OK)
  applyCoupon(@Body() applyCouponDto : ApplyCouponDto) {
    return this.cuponesService.applyCupon(applyCouponDto.cupon_nombre);
  }
}
