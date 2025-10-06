import { Module } from '@nestjs/common';
import { TransaccionsService } from './transaccions.service';
import { TransaccionsController } from './transaccions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaccion } from './entities/transaccion.entity';
import { Producto } from '../productos/entities/producto.entity';
import { CuponesModule } from '../cupones/cupones.module';
import { TransaccionContenidos } from './entities/transaccion-contenidos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaccion,
      TransaccionContenidos,
      Producto
    ]), CuponesModule],
  controllers: [TransaccionsController],
  providers: [TransaccionsService],
})
export class TransaccionsModule { }
