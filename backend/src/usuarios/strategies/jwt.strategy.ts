import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Usuario } from "../entities/usuario.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET') || 'defaultSecretKey',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload): Promise<Usuario> {
        console.log('Tipo de ID:', typeof payload.id);
        const { id } = payload;
        const user = await this.usuarioRepository.findOne({
            where: { id: id },
            relations: ['role']
        });

        if (!user) throw new Error('Token no válido - usuario no existe');
        return user;
    }
}