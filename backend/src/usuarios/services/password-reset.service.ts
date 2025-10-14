import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "../entities/usuario.entity";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import bcrypt from "node_modules/bcryptjs";
import { MailService } from "src/mailer/mailer.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PasswordResetService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        private readonly configService: ConfigService
    ) { }

    async requestReset(correo: string): Promise<string> {
        const user = await this.usuarioRepository.findOneBy({ correo });
        const responseText = 'Si el correo está registrado, se enviará un enlace de recuperación';
        // Mensaje genérico para evitar fuga de datos
        if (!user) return responseText;

        const payload = { id: user.id };
        const token = this.jwtService.sign(payload, {
            expiresIn: '1h',
            secret: process.env.JWT_RESET_SECRET,
        });

        const url = new URL(this.configService.get('FRONTEND_URL') ?? '');
        url.searchParams.set('token', token);
        await this.mailService.sendResetPasswordEmail(user, url.toString());
        return responseText;
    }

    async resetPassword(token: string, nuevaContrasena: string): Promise<string> {
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_RESET_SECRET,
            });

            const user = await this.usuarioRepository.findOneBy({ id: payload.id });
            if (!user) throw new NotFoundException('Usuario no encontrado');

            user.contrasena = await bcrypt.hash(nuevaContrasena, 10);
            await this.usuarioRepository.save(user);

            return 'Contraseña actualizada correctamente';
        } catch (error) {
            throw new NotFoundException('Token inválido o expirado');
        }
    }
}