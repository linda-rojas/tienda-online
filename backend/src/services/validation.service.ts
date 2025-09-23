import { Injectable, NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class ValidationService {
    async existsOrFail<T extends ObjectLiteral>(
        repository: Repository<T>,
        field: keyof T,
        value: any,
        message: string,
    ) {
        const entity = await repository.findOne({ where: { [field]: value } as any });

        if (entity) {
            throw new ConflictException(message);
        }
    }

    handleExceptions(error: any) {
        console.error('Error capturado:', error);

        if (error instanceof NotFoundException || error instanceof ConflictException) {
            throw error;
        }

        if (error.code === '23505') {
            throw new ConflictException('Ya existe un registro con estos datos');
        }
        // error genérico
        throw new Error(`Ha ocurrido un error inesperado: ${error.message || error}`);
    }
}
