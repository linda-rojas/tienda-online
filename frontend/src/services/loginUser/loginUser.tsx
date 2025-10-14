export const loginUser = async (email: string, password: string) => {

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, contrasena: password }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error en la petición", error);
    return { success: false, error: 'Hubo un problema al intentar iniciar sesión' };
  }
};
