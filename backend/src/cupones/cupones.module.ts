import { Module } from '@nestjs/common';
import { CuponesService } from './cupones.service';
import { CuponesController } from './cupones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cupone } from './entities/cupone.entity';
import { ValidationService } from 'src/services/validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cupone])],
  controllers: [CuponesController],
  providers: [CuponesService, ValidationService],
  exports: [CuponesService]
})
export class CuponesModule { }
