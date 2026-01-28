const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const requestPasswordReset = async (correo: string) => {
    try {
        const res = await fetch(`${API_URL}/usuarios/solicitud-de-restablecimiento-de-contrasena`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ correo }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                success: false,
                data: null,
                error: data?.message || "No se pudo enviar el enlace de restablecimiento",
            };
        }

        return {
            success: true,
            data,
            error: null,
        };
    } catch (error: any) {
        return {
            success: false,
            data: null,
            error: error?.message || "Error de conexión con el servidor",
        };
    }
};

export const resetPassword = async (token: string, nuevaContrasena: string) => {
    try {
        const res = await fetch(`${API_URL}/usuarios/restablecer-contrasena`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, nuevaContrasena }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                success: false,
                data: null,
                error: data?.message || "Token inválido o expirado",
            };
        }

        return {
            success: true,
            data,
            error: null,
        };
    } catch (error: any) {
        return {
            success: false,
            data: null,
            error: error?.message || "Error de conexión con el servidor",
        };
    }
};
