export const validateEmail = (correo: string) => {
    if (!correo.trim()) return "El correo es obligatorio";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) return "Correo inválido";
    return "";
};

export const validateNewPassword = (password: string) => {
    if (!password.trim()) return "La contraseña es obligatoria";

    const regex = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    if (!regex.test(password)) {
        return "Debe tener mayúscula, minúscula y número";
    }

    if (password.length < 6) {
        return "Debe tener mínimo 6 caracteres";
    }

    return "";
};
