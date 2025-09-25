import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "../entities/usuario.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import bcrypt from "node_modules/bcryptjs";

@Injectable()
export class PasswordResetService {
    constructor(
        private readonly jwtService: JwtService,
        // private readonly mailerService: MailerService,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) { }

    async requestReset(correo: string): Promise<string> {
        const user = await this.usuarioRepository.findOneBy({ correo });

        // Mensaje genérico para evitar fuga de datos
        if (!user) return 'Si el correo está registrado, se enviará un enlace de recuperación';

        const payload = { id: user.id };
        const token = this.jwtService.sign(payload, {
            expiresIn: '30m',
            secret: process.env.JWT_RESET_SECRET,
        });

        const resetLink = `https://tuapp.com/reset-password?token=${token}`;

        // await this.mailerService.sendResetPasswordEmail(user.correo, resetLink);

        return 'Si el correo está registrado, se enviará un enlace de recuperación';
    }

    async resetPassword(token: string, nuevaContraseña: string): Promise<string> {
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_RESET_SECRET,
            });

            const user = await this.usuarioRepository.findOneBy({ id: payload.id });
            if (!user) throw new NotFoundException('Usuario no encontrado');

            user.contraseña = await bcrypt.hash(nuevaContraseña, 10);
            await this.usuarioRepository.save(user);

            return 'Contraseña actualizada correctamente';
        } catch (error) {
            throw new NotFoundException('Token inválido o expirado');
        }
    }
}