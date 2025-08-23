import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { entities } from "./entities.config";

export const typeOrmConfig = (configService: ConfigService) : TypeOrmModuleOptions  => {
    const useSSL = configService.get('DATABASE_USE_SSL') === 'true';
    const config: TypeOrmModuleOptions = {
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASS'),
        port: configService.get('DATABASE_PORT'),
        database: configService.get('DATABASE_NAME'),
        ssl: useSSL,
        extra: useSSL
        ? {
            ssl: {
            rejectUnauthorized: false,
            },
        }
        : {},
        logging: true,
        entities,
        synchronize: true
    }
    return config;
}
