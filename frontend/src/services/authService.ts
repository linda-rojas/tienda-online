import { UserSchema, type User } from '@/schemas/schemas';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const loginUser = async (email: string, password: string): Promise<{ success: true, usuario: User } | { success: false, error: any }> => {
    try {
        const res = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: email, contrasena: password }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Error en las credenciales');
        }

        const data = await res.json();
        console.log('Datos recibidos del backend:', data);

        if (!data || !data.usuario) {
            console.error(`No se encontró el campo ${data.usuario} en los datos:`, data);
            throw new Error('Usuario no encontrado');
        }

        const usuario = {
            ...data.usuario,
        };

        const usuarioValidado = UserSchema.parse(usuario);
        console.log('Respuesta del backend:', usuarioValidado);

        localStorage.setItem('token', data.token);

        return { success: true, usuario: usuarioValidado };
    } catch (error: any) {
        console.error('Error al hacer login:', error);
        toast.error(error.message || 'Error desconocido', { position: 'top-center' });
        return { success: false, error };
    }
};
