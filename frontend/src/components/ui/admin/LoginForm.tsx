'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { loginUser } from '@/services/loginUser/loginUser';
import { validateEmail, validatePassword } from '@/services/loginUser/validation';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const params = new URLSearchParams(window.location.search);

    if (params.get('expired') === 'true') {
      toast.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', {
        position: 'top-right',
        autoClose: 4000,
      });
    }

    if (params.get('unauthorized') === 'true') {
      toast.error('No tienes permiso para acceder a esta sección.', {
        position: 'top-right',
        autoClose: 4000,
      });
    }

    const storedUser = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    // 🚨 Si no hay token o usuario → no redirigir (mostrar login)
    if (!storedUser || !token) return;

    // ✅ Verificar si el token está expirado antes de redirigir
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expMs = payload.exp * 1000;
      const isExpired = Date.now() > expMs;

      if (isExpired) {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        return;
      }

      // Extraer rol correctamente
      const parsedUser = JSON.parse(storedUser);
      const role =
        typeof parsedUser.role === 'string'
          ? parsedUser.role.toLowerCase()
          : parsedUser.role?.nombre?.toLowerCase();

      // ✅ Redirigir según el rol
      if (role === 'administrador') {
        toast.success('Bienvenido administrador 👑', {
          onClose: () => {
            setTimeout(() => {
              window.location.href = '/admin/sales'; // Redirigir a /admin/sales
            }, 800);
          },
        });
      } else {
        toast.success('Bienvenido, serás redirigido a la tienda 🛍️', {
          onClose: () => {
            setTimeout(() => {
              window.location.href = '/';
            }, 800);
          },
        });
      }
    } catch (err) {
      console.error('Error validando token:', err);
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setUserData(null);

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (emailValidation || passwordValidation) {
      setEmailError(emailValidation);
      setPasswordError(passwordValidation);
      return;
    }

    const { success, data, error } = await loginUser(email, password);

    if (!success) {
      if (error === 'Usuario con correo no encontrado') {
        toast.error('El correo electrónico no está registrado.');
      } else if (error === 'Contraseña incorrecta') {
        toast.error('La contraseña es incorrecta.');
      } else {
        toast.error('Hubo un error en el proceso de inicio de sesión.');
      }
      return;
    }

    if (data) {
      localStorage.setItem('usuario', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      setUserData(data);

      // 🧠 NUEVO: guardar también en cookies (middleware las usa)
      document.cookie = `token=${data.token}; path=/; max-age=3600;`; // 1 hora
      const role =
        typeof data.role === 'string'
          ? data.role.toLowerCase()
          : data.role?.nombre?.toLowerCase();
      document.cookie = `role=${role}; path=/; max-age=3600;`;

      // Redirección igual que antes
      if (role === 'administrador') {
        toast.success('Bienvenido administrador 👑', {
          onClose: () => {
            setTimeout(() => {
              window.location.href = '/admin/sales'; // Redirigir a /admin/sales
            }, 800);
          },
        });
      } else {
        toast.success('Bienvenido, serás redirigido a la tienda 🛍️', {
          onClose: () => {
            setTimeout(() => {
              window.location.href = '/';
            }, 800);
          },
        });
      }
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex justify-center p-4 items-center m-6 bg-gray-100">
      <div className="w-full max-w-lg p-4 sm:p-8 lg:p-8 bg-white shadow-xl rounded-lg">
        <h2 className="text-[20px] sm:text-2xl lg:text-3xl font-bold text-center mb-6 text-gray-600">
          Iniciar sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-[14px] sm:text-[17px] font-semibold text-gray-500"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              className={`w-full p-2 border text-gray-500 ${emailError ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && (
              <div className="text-red-500 text-sm mt-1">{emailError}</div>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[14px] sm:text-[17px] font-semibold text-gray-500"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              className={`w-full p-2 border text-gray-500 ${passwordError ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && (
              <div className="text-red-500 text-sm mt-1">{passwordError}</div>
            )}
          </div>

          <div className="w-full flex items-center justify-around mt-6 lg:mt-0">
            <button
              type="submit"
              className="w-[70px] sm:w-[150px] lg:w-[200px] bg-gradient-to-r from-[#023D71] to-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300 cursor-pointer text-[15px] sm:text-[18px] lg:text-[18px]"
            >
              Entrar
            </button>
            <div className="text-center">
              <Link
                href="/"
                className="inline-block bg-white text-red-700 font-semibold py-1 sm:py-2 lg:py-2 px-2 sm:px-4 lg:px-4 rounded-full shadow-lg border-2 text-[13px] sm:text-[17px] lg:text-[17px] border-red-700 hover:bg-red-700 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Volver a la tienda
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/admin/register"
            className="text-gray-500 hover:text-gray-600 text-[14px] sm:text-[16px] font-semibold"
          >
            ¿Aún no estás registrado? Regístrate
          </Link>
        </div>

        <div className="mt-2 text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-600 text-[14px] sm:text-[16px] font-semibold"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
