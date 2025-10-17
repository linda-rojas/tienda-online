'use client';
import { FaUser } from 'react-icons/fa';
import { montserrat } from '../../ui/fonts';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AccountLinkDesktop() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    // Comprobar si hay un usuario en el localStorage
    const storedUsuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const storedToken = localStorage.getItem('token');

    // Verifica si el usuario está logueado
    if (storedUsuario && storedToken) {
      setIsLoggedIn(true);
      setUsuario(storedUsuario);
    }
  }, []);

  return (
    <Link
      href={isLoggedIn ? '/admin/my-acount' : '/admin/login'} // Redirige a "mi cuenta" si está logueado, o a login si no lo está
      className="hidden items-center gap-2 cursor-pointer md:flex md:gap-1 lg:flex"
    >
      <span className={`${montserrat.className} text-white text-center md:hidden lg:flex`}>
        Mi cuenta
      </span>
      <FaUser className="h-5 w-5 text-white" />
    </Link>
  );
}
