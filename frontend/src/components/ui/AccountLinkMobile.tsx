import { FaUser } from 'react-icons/fa';
import { montserrat } from '../../ui/fonts';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AccountLinkMobileProps {
  closeMenu: () => void
}

export default function AccountLinkMobile({ closeMenu }: AccountLinkMobileProps) {
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
      className="flex max-w-fit items-center gap-2 cursor-pointer md:hidden lg:hidden"
      onClick={closeMenu}
    >
      <span className={`${montserrat.className} text-blue-400 text-center`}>
        Mi cuenta
      </span>
      <FaUser className="h-5 w-5 text-blue-400" />
    </Link>
  );
}
