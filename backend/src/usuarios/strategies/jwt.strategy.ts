import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Usuario } from "../entities/usuario.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET') || 'defaultSecretKey',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload) {
        const id = Number(payload.id);

        if (!id || Number.isNaN(id)) {
            throw new UnauthorizedException('Token inválido (id no válido)');
        }

        const user = await this.usuarioRepository.findOne({
            where: { id },
            relations: ['role'],
        });

        if (!user) {
            throw new UnauthorizedException('Token no válido - usuario no existe');
        }

        return user; // esto se inyecta en req.user
    }
}