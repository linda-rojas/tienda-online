import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { GetProductsQueryDto } from './dto/get-product.dto';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';

@Controller('productos')
export class ProductosController {
  constructor(
    private readonly productosService: ProductosService,
  ) { }

  @Post()
  @FormDataRequest({ storage: MemoryStoredFile })
  async create(
    @Body() createProductoDto: CreateProductoDto,
  ) {
    // Si vienen imágenes en la petición multipart, se procesarán automáticamente
    // por nestjs-form-data, pero como tu UploadImageService usa UploadImageRequest[],
    // las enviaremos en otro endpoint si lo deseas (ver más abajo).
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll(@Query() query: GetProductsQueryDto) {
    const categoria = query.categoria_id ? query.categoria_id : null
    const take = query.take ? query.take : 8
    const skip = query.skip ? query.skip : 0
    const q = query.q?.trim() || null

    return this.productosService.findAll(categoria, take, skip, q);
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: number) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  @FormDataRequest({ storage: MemoryStoredFile })
  async update(
    @Param('id', IdValidationPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }


  @Delete(':id')
  remove(@Param('id', IdValidationPipe) id: number) {
    return this.productosService.remove(id);
  }
}
