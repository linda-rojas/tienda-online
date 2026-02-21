import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryResponse } from './upload-image.response';
import { Imagen, ImageType } from 'src/productos/entities/imagenes.entity';
import { ProductosService } from 'src/productos/productos.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import streamifier from 'streamifier';
import { UploadImageRequest } from './interfaces/upload-image-request.interface';
import { MemoryStoredFile } from 'nestjs-form-data';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class UploadImageService {
  constructor(
    @InjectRepository(Imagen) private readonly imagenRepository: Repository<Imagen>,
    @Inject(forwardRef(() => ProductosService))
    private readonly productoService: ProductosService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow('CLOUDINARY_NAME'),
      api_key: this.configService.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow('CLOUDINARY_API_SECRET'),
    });
  }
  uploadFile(file: MemoryStoredFile): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error)
          if (!result) {
            return reject(new Error("No se obtuvo resultado de Cloudinary"));
          }
          resolve(result)
        }
      )

      streamifier.createReadStream(file.buffer).pipe(uploadStream)
    })
  }

  async uploadFiles(uploadImages: UploadImageRequest[], productoId: number) {
    if (!uploadImages.length) {
      throw new BadRequestException('No se recibieron imágenes (images[])');
    }

    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Imagen);

      // 1️⃣ Traer imágenes actuales del producto
      const existingImages = await repo.find({
        where: { producto: { id: productoId } as any },
      });

      // No se eliminan las imágenes actuales, simplemente las dejamos intactas.

      // 2️⃣ Subir nuevas imágenes
      const cloudinaryFiles = await Promise.all(
        uploadImages.map(async (uploadImage) => {
          // Cambiar tipo a 'gallery' si ya existe una imagen 'primary' o 'secondary'
          if (uploadImage.type === 'primary' && existingImages.some(img => img.type === 'primary')) {
            uploadImage.type = 'gallery'; // Cambiar tipo a 'gallery' si ya existe 'primary'
          }
          if (uploadImage.type === 'secondary' && existingImages.some(img => img.type === 'secondary')) {
            uploadImage.type = 'gallery'; // Cambiar tipo a 'gallery' si ya existe 'secondary'
          }

          const cloudinaryFile = await this.uploadFile(uploadImage.file);
          return {
            cloudinaryFile,
            type: uploadImage.type,
          };
        }),
      );

      const producto = await this.productoService.findOne(productoId);

      const imagenes = cloudinaryFiles.map(({ cloudinaryFile, type }) => {
        const imagen = new Imagen();
        imagen.url = cloudinaryFile.secure_url;
        imagen.producto = producto;
        imagen.type = type as ImageType;
        imagen.publicId = cloudinaryFile.public_id;
        return imagen;
      });

      // 3️⃣ Guardar nuevas imágenes sin eliminar las existentes
      await repo.save(imagenes);

      return imagenes;
    });
  }



  // Método para obtener las imágenes de un producto
  async getImagesByProductId(productoId: number): Promise<Imagen[]> {
    return this.imagenRepository.find({
      where: {
        producto: {
          id: productoId,
        },
      },
      select: { id: true, url: true, type: true, publicId: true },
    });
  }

  async changeImageType(
    productoId: number,
    imageId: number,
    type: 'primary' | 'secondary' | 'gallery',
  ) {
    // 1) validar que el producto existe (mantiene tu estilo)
    await this.productoService.findOne(productoId);

    // 2) traer imagen y validar pertenencia
    const image = await this.imagenRepository.findOne({
      where: { id: imageId },
      relations: ['producto'],
    });

    if (!image) throw new NotFoundException('Imagen no encontrada');
    if (image.producto?.id !== productoId) {
      throw new BadRequestException('La imagen no pertenece a este producto');
    }

    // 3) transacción para asegurar consistencia
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Imagen);

      // si setea primary/secondary, liberar el anterior
      if (type === 'primary' || type === 'secondary') {
        const current = await repo.findOne({
          where: {
            producto: { id: productoId } as any,
            type: type as any,
          },
          relations: ['producto'],
        });

        if (current && current.id !== imageId) {
          current.type = 'gallery';
          await repo.save(current);
        }
      }

      image.type = type;
      await repo.save(image);

      // opcional: devolver lista actualizada de imágenes del producto
      return repo.find({
        where: { producto: { id: productoId } as any },
        order: { id: 'DESC' },
      });
    });
  }


  async deleteImage(productoId: number, imageId: number) {
    const img = await this.imagenRepository.findOne({
      where: { id: imageId },
      relations: ['producto'],
    });

    if (!img) throw new NotFoundException('Imagen no encontrada');

    if (img.producto?.id !== productoId) {
      throw new BadRequestException('La imagen no pertenece a este producto');
    }

    // 1) borrar en Cloudinary
    if (img.publicId) {
      await cloudinary.uploader.destroy(img.publicId).catch(() => null);
    }

    // 2) borrar en DB
    await this.imagenRepository.delete({ id: imageId });

    return { ok: true };
  }
}
