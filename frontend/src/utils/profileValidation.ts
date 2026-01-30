import type { ProfileForm } from '@/types/my-account';

export const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getProfileErrors = (profileForm: ProfileForm) => {
    const e: Record<string, string> = {};

    if (!profileForm.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!profileForm.apellidos.trim()) e.apellidos = 'Los apellidos son obligatorios';

    if (!profileForm.correo.trim()) e.correo = 'El correo es obligatorio';
    else if (!validateEmail(profileForm.correo)) e.correo = 'Correo inválido';

    if (!profileForm.celular.trim()) e.celular = 'El celular es obligatorio';
    else if (!/^[3]\d{9}$/.test(profileForm.celular))
        e.celular = 'Debe tener 10 dígitos y comenzar con 3';

    return e;
};
