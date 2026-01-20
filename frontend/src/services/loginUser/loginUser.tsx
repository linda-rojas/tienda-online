export const loginUser = async (email: string, password: string) => {

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, contrasena: password }),
    });
    const data = await response.json().catch(() => ({}));

    // ✅ Si el backend respondió error, extraemos el mensaje
    if (!response.ok) {
      const backendMessage =
        Array.isArray(data?.message) ? data.message[0] :
          data?.message || data?.error || 'Credenciales inválidas';

      return {
        success: false,
        data: null,
        error: backendMessage,
      };
    }

    // ✅ Si todo ok
    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    console.error("Error en la petición", error);
    return {
      success: false,
      data: null,
      error: 'Hubo un problema al intentar iniciar sesión',
    };
  }
};
