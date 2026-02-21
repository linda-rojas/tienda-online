import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { Categoria } from '../categorias/entities/categoria.entity';
import { ValidationService } from 'src/services/validation.service';
import { Imagen } from './entities/imagenes.entity';
import { v2 as cloudinary } from 'cloudinary';
import { UploadImageService } from 'src/upload-image/upload-image.service';
import { UploadImageRequest } from 'src/upload-image/interfaces/upload-image-request.interface';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto) private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria) private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Imagen) private readonly imagenRepo: Repository<Imagen>,
    @Inject(forwardRef(() => UploadImageService))
    private readonly uploadImageService: UploadImageService,
    @Inject(ValidationService) private readonly validationService: ValidationService

  ) { }


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


  async findAll(categoriaId: number | null, take: number, skip: number, q?: string | null) {
    try {
      const qb = this.productoRepository
        .createQueryBuilder("p")
        .leftJoinAndSelect("p.categoria", "c")
        .leftJoinAndSelect("p.imagenes", "i")
        .orderBy("p.id", "DESC")
        .take(take)
        .skip(skip);

      if (categoriaId) {
        qb.andWhere("p.categoriaId = :categoriaId", { categoriaId });
      }

      if (q) {
        qb.andWhere(
          "(p.nombre ILIKE :q OR p.subtitulo ILIKE :q OR p.descripcion ILIKE :q)",
          { q: `%${q}%` }
        );
      }

      const [productos, total] = await qb.getManyAndCount();

      return { productos, total };
    } catch (error) {
      this.validationService.handleExceptions(error);
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

  async update(id: number, updateProductoDto: UpdateProductoDto, uploadImages?: UploadImageRequest[]) {
    try {
      const productoExistente = await this.findOne(id);

      // Verificar si la categoría existe y actualizarla
      if (updateProductoDto.categoriaId) {
        const categoria = await this.categoriaRepository.findOneBy({ id: updateProductoDto.categoriaId });
        if (!categoria) {
          throw new NotFoundException('La categoría no existe');
        }
        productoExistente.categoria = categoria;
      }

      // Verificar las imágenes existentes del producto
      const existingImages = productoExistente.imagenes;
      const hasPrimary = existingImages.some((img) => img.type === 'primary');
      const hasSecondary = existingImages.some((img) => img.type === 'secondary');

      // Cambiar tipo de las nuevas imágenes a 'gallery' si ya existe un 'primary' o 'secondary'
      if (uploadImages && uploadImages.length > 0) {
        uploadImages.forEach((img) => {
          if (img.type === 'primary' && hasPrimary) {
            img.type = 'gallery'; // Si ya existe un 'primary', cambiar a 'gallery'
          }
          if (img.type === 'secondary' && hasSecondary) {
            img.type = 'gallery'; // Si ya existe un 'secondary', cambiar a 'gallery'
          }
        });
      }

      const producto = await this.productoRepository.preload({
        id: id,
        ...updateProductoDto,
      });

      if (!producto) {
        throw new NotFoundException(`El producto con el id: ${id} no fue encontrado`);
      }

      const productoActualizado = await this.productoRepository.save(producto);

      // Subir nuevas imágenes si llegan
      if (uploadImages && uploadImages.length > 0) {
        await this.uploadImageService.uploadFiles(uploadImages, productoActualizado.id);
      }

      // Retornar el producto con las imágenes actualizadas
      return this.findOne(productoActualizado.id);

    } catch (error) {
      this.validationService.handleExceptions(error);
    }
  }



  async remove(productoId: number) {
    const producto = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['imagenes'],
    });

    if (!producto) throw new NotFoundException('Producto no encontrado');

    // 1) borrar en Cloudinary (si tienes publicId)
    const publicIds = (producto.imagenes || [])
      .map((img) => img.publicId)
      .filter(Boolean);

    if (publicIds.length) {
      // borra uno por uno (seguro)
      await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)));
    }

    // 2) borrar producto (y DB elimina imágenes por cascade)
    await this.productoRepository.delete({ id: productoId });

    return { ok: true };
  }
}