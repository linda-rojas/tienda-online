import { Module } from '@nestjs/common';
import { TransaccionsService } from './transaccions.service';
import { TransaccionsController } from './transaccions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaccion, TransaccionContenidos } from './entities/transaccion.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaccion, TransaccionContenidos, Producto])],
  controllers: [TransaccionsController],
  providers: [TransaccionsService],
})
export class TransaccionsModule {}
