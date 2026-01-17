import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Categoria } from '../categorias/entities/categoria.entity';
import { ValidationService } from 'src/services/validation.service';
import { Imagen } from './entities/imagenes.entity';
import { UploadImageService } from 'src/upload-image/upload-image.service';
import { UploadImageRequest } from 'src/upload-image/upload-image-request.interface';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto) private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria) private readonly categoriaRepository: Repository<Categoria>,
    @Inject(forwardRef(() => UploadImageService))
    private readonly uploadImageService: UploadImageService,
    @Inject(ValidationService) private readonly validationService: ValidationService

  ) { }

  // async create(createProductoDto: CreateProductoDto) {
  //   try {
  //     const categoria = await this.categoriaRepository.findOneBy({ id: createProductoDto.categoriaId as unknown as number });
  //     // si no existe ese id retorna:
  //     if (!categoria) {
  //       throw new NotFoundException('la categoria no existe');
  //     }

  //     // Verificar si ya existe un producto con el mismo nombre
  //     await this.validationService.existsOrFail(
  //       this.productoRepository,
  //       'nombre',
  //       createProductoDto.nombre,
  //       'El nombre del producto ya está en uso'
  //     );

  //     const producto = this.productoRepository.create({
  //       ...createProductoDto,
  //       categoria,
  //       // imagenes: []
  //     })

  //     if (createProductoDto.imagenesUrl && createProductoDto.imagenesUrl.length > 0) {
  //       const imagenes = createProductoDto.imagenesUrl.map((imagenUrl) => {
  //         const imagen = new Imagen();
  //         imagen.url = imagenUrl;
  //         imagen.producto = producto;
  //         return imagen;
  //       });

  //       producto.imagenes = imagenes;
  //     }

  //     const productoGuardado = await this.productoRepository.save(producto);

  //     return productoGuardado;
  //   } catch (error) {
  //     this.validationService.handleExceptions(error)
  //   }
  // }

  // async create(createProductoDto: CreateProductoDto) {
  //   try {
  //     const categoria = await this.categoriaRepository.findOneBy({ id: createProductoDto.categoriaId });

  //     if (!categoria) {
  //       throw new NotFoundException('La categoría no existe');
  //     }

  //     // Verificar si el producto ya existe
  //     await this.validationService.existsOrFail(
  //       this.productoRepository,
  //       'nombre',
  //       createProductoDto.nombre,
  //       'El nombre del producto ya está en uso'
  //     );

  //     // Crear el producto
  //     const producto = this.productoRepository.create({
  //       ...createProductoDto,
  //       categoria, // Asignamos la categoría
  //     });

  //     // Crear instancias de `Imagen` a partir de las URLs
  //     // if (createProductoDto.imagenesUrl && createProductoDto.imagenesUrl.length > 0) {
  //     //   const imagenes = createProductoDto.imagenesUrl.map((url) => {
  //     //     const imagen = new Imagen();
  //     //     imagen.url = url;
  //     //     imagen.producto = producto; // Asociamos la imagen al producto
  //     //     return imagen;
  //     //   });

  //     //   producto.imagenes = imagenes; // Asignamos las imágenes al producto
  //     // }

  //     // Guardar el producto con las imágenes asociadas
  //     const productoGuardado = await this.productoRepository.save(producto);

  //     return productoGuardado; // Devolvemos el producto guardado
  //   } catch (error) {
  //     this.validationService.handleExceptions(error);
  //   }
  // }

  async create(createProductoDto: CreateProductoDto, uploadImages?: UploadImageRequest[]) {
    try {
      // 1️⃣ Verificar si la categoría existe
      const categoria = await this.categoriaRepository.findOneBy({
        id: createProductoDto.categoriaId,
      });
      if (!categoria) throw new NotFoundException('La categoría no existe');

      // 2️⃣ Validar que no exista otro producto con el mismo nombre
      await this.validationService.existsOrFail(
        this.productoRepository,
        'nombre',
        createProductoDto.nombre,
        'El nombre del producto ya está en uso',
      );

      // 3️⃣ Crear el producto sin las imágenes
      const producto = this.productoRepository.create({
        ...createProductoDto,
        categoria,
      });

      // Guardar el producto en la base de datos (sin imágenes)
      const productoGuardado = await this.productoRepository.save(producto);

      // 4️⃣ Subir las imágenes si existen
      if (uploadImages && uploadImages.length > 0) {
        await this.uploadImageService.uploadFiles(uploadImages, productoGuardado.id);
      }

      // 5️⃣ Retornar el producto con sus imágenes asociadas
      return this.findOne(productoGuardado.id);
    } catch (error) {
      this.validationService.handleExceptions(error);
    }
  }


  async findAll(categoriaId: number | null, take: number, skip: number) {
    try {
      const options: FindManyOptions<Producto> = {
        // para que me traiga la categoria
        relations: {
          categoria: true,
          imagenes: true,
        },
        order: {
          id: 'DESC'
        },
        take,
        skip
      }

      if (categoriaId) {
        options.where = {
          categoria: {
            id: categoriaId
          }
        }
      }

      const [productos, total] = await this.productoRepository.findAndCount(options)

      return {
        productos, // muestra todos los datos de la consulta
        total // registros en total
      }
    } catch (error) {
      this.validationService.handleExceptions(error)

    }
  }

  async findOne(id: number) {
    const producto = await this.productoRepository.findOne({
      where: {
        id
      },
      relations: {
        categoria: true,
        imagenes: true
      }
    })

    if (!producto) {
      throw new NotFoundException(`El producto con el id: ${id} no fue encontrado`)
    }
    return producto;
  }

  // actualiza productos
  // async update(id: number, updateProductoDto: UpdateProductoDto) {
  //   try {
  //     const productoExistente = await this.findOne(id);

  //     if (updateProductoDto.categoriaId) {
  //       const categoria = await this.categoriaRepository.findOneBy({ id: updateProductoDto.categoriaId as unknown as number });
  //       // si no existe categoria con ese id retorna:
  //       if (!categoria) {
  //         throw new NotFoundException('la categoria no existe');
  //       }
  //       productoExistente.categoria = categoria
  //     }

  //     if (updateProductoDto.nombre && updateProductoDto.nombre !== productoExistente.nombre) {
  //       // console.log(updateProductoDto.nombre)
  //       await this.validationService.existsOrFail(
  //         this.productoRepository,
  //         'nombre',
  //         updateProductoDto.nombre,
  //         'El nombre del producto ya está en uso'
  //       );
  //     }

  //     const imagenes = updateProductoDto.imagenesUrl.map(imagenUrl => {
  //       const imagen = new Imagen();
  //       imagen.producto = productoExistente;
  //       imagen.url = imagenUrl;
  //       return imagen;
  //     });

  //     const producto = await this.productoRepository.preload({
  //       ...updateProductoDto,
  //       id,
  //       imagenes,
  //     });

  //     if (!producto) {
  //       throw new NotFoundException(`El producto con el id: ${id} no fue encontrado`)
  //     }

  //     return await this.productoRepository.save(producto);

  //   } catch (error) {
  //     this.validationService.handleExceptions(error)
  //   }
  // }

  async update(id: number, updateProductoDto: UpdateProductoDto, uploadImages?: UploadImageRequest[]) {
    try {
      const productoExistente = await this.findOne(id);

      if (updateProductoDto.categoriaId) {
        const categoria = await this.categoriaRepository.findOneBy({ id: updateProductoDto.categoriaId });

        if (!categoria) {
          throw new NotFoundException('La categoría no existe');
        }
        productoExistente.categoria = categoria;
      }

      const producto = await this.productoRepository.preload({
        id: id,
        ...updateProductoDto,
      });

      if (!producto) {
        throw new NotFoundException(`El producto con el id: ${id} no fue encontrado`);
      }

      const productoActualizado = await this.productoRepository.save(producto);

      // Subir y asociar nuevas imágenes (si llegan)
      if (uploadImages && uploadImages.length > 0) {
        await this.uploadImageService.uploadFiles(uploadImages, productoActualizado.id);
      }

      // Retornar el producto con sus relaciones actualizadas
      return this.findOne(productoActualizado.id);

    } catch (error) {
      this.validationService.handleExceptions(error);
    }
  }


  async remove(id: number) {
    const producto = await this.findOne(id)
    await this.productoRepository.remove(producto)
    return { message: 'Producto eliminado con éxito' };
  }
}