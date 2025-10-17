'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaUserCircle } from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("perfil");
  const [usuarioData, setUsuarioData] = useState<any>(null);
  const [transacciones, setTransacciones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  interface Direccion {
    direccion: string;
    ciudad: string;
    departamento: string;
    celular: string;
  }

  useEffect(() => {
    const fetchUsuarioData = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        // Si no hay usuario en el localStorage, redirige al login
        if (!usuario || !usuario.id) {
          window.location.href = '/admin/login';
          return;
        }

        // Si el rol es administrador, redirige al panel de administración
        const role = typeof usuario.role === 'string'
          ? usuario.role.toLowerCase()
          : usuario.role?.nombre?.toLowerCase();

        if (role === 'administrador') {
          window.location.href = '/admin/sales';
          return;
        }

        // Si es un usuario normal, continua con la carga de datos
        const response = await fetch(`${API_URL}/usuarios/${usuario.id}`);
        const data = await response.json();

        if (response.ok) {
          setUsuarioData(data);
          const resTransacciones = await fetch(`${API_URL}/transacciones`);
          const dataTransacciones = await resTransacciones.json();
          const transaccionesDelUsuario = dataTransacciones.filter(
            (t: any) => t.usuario?.id === usuario.id
          );
          setTransacciones(transaccionesDelUsuario);
        } else {
          toast.error('Error al cargar los datos del usuario', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.log('Error fetching usuario data:', error);
        toast.error('Hubo un problema al cargar los datos del usuario', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuarioData();
  }, []);


  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!usuarioData) {
    return <div>No se encontraron datos del usuario.</div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-[50%] bg-white text-white shadow-lg p-4 sm:p-6 lg:p-6 rounded-l-lg color-blue-footer-bg">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-600">
            <FaUserCircle />
          </div>
        </div>
        <div className='flex flex-col items-center text-[16px] sm:text-[18px] lg:text-xl'>
          <h2 className="text-center font-semibold ">
            ¡Bienvenido!
          </h2>
          <h3 className="text-center font-semibold">
            {usuarioData.nombre}
          </h3>
        </div>
        <div className="mt-6 space-y-4">
          <div
            className={`p-2 cursor-pointer hover:bg-gray-500 rounded text-[15px] sm:text-[16px] lg:text-[17px] ${activeTab === "perfil" ? "bg-gray-500" : ""}`}
            onClick={() => setActiveTab("perfil")}
          >
            Perfil
          </div>
          <div
            className={`p-2 cursor-pointer hover:bg-gray-500 rounded text-[15px] sm:text-[16px] lg:text-[17px] ${activeTab === "direcciones" ? "bg-gray-500" : ""}`}
            onClick={() => setActiveTab("direcciones")}
          >
            Direcciones
          </div>
          <div
            className={`p-2 cursor-pointer hover:bg-gray-500 rounded text-[15px] sm:text-[16px] lg:text-[17px] ${activeTab === "compras" ? "bg-gray-500" : ""}`}
            onClick={() => setActiveTab("compras")}
          >
            Mis compras
          </div>
        </div>
        <div className="mt-12 text-center w-full">
          <Link
            href="/"
            className="bg-red-700 hover:bg-red-800 text-white font-medium sm:font-semibold lg:font-semibold py-2 px-2 lg:px-4 rounded-lg text-[14px] sm:text-[16px] lg:text-[17px]"
            onClick={() => {
              localStorage.removeItem("usuario");
              localStorage.removeItem("token");
              document.cookie = "token=; Max-Age=0; path=/";
              document.cookie = "role=; Max-Age=0; path=/";
            }}
          >
            Cerrar sesión
          </Link>
        </div>
      </div>
      <div className="w-3/4 p-3 sm:p-6 lg:p-6 bg-gray-100">
        {activeTab === "perfil" && (
          <div className='text-gray-700'>
            <h3 className="text-2xl font-semibold text-[16px] sm:text-[18px] lg:text-xl">Perfil</h3>
            <div className="mt-4 flex flex-col gap-4 bg-gray-50 p-3 sm:p-5 lg:p-7 rounded-lg shadow">
              <div className="flex flex-col mb-2">
                <span className="font-semibold text-[14px] sm:text-[16px] lg:text-[17px]">Nombre:</span>
                <span className='ml-3 text-[14px] sm:text-[15px] lg:text-[16px]'>{usuarioData.nombre} {usuarioData.apellidos}</span>
              </div>
              <div className="flex flex-col mb-2">
                <span className="font-semibold text-[14px] sm:text-[16px] lg:text-[17px]">Correo:</span>
                <span className='ml-3 text-[14px] sm:text-[15px] lg:text-[16px]'>{usuarioData.correo}</span>
              </div>
              <div className="flex flex-col mb-2">
                <span className="font-semibold text-[14px] sm:text-[16px] lg:text-[17px]">Celular:</span>
                <span className='ml-3 text-[14px] sm:text-[15px] lg:text-[16px]'>{usuarioData.celular}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "direcciones" && (
          <div>
            <h3 className="text-2xl font-semibold text-[16px] sm:text-[18px] lg:text-xl text-gray-700">Direcciones</h3>
            <div className="mt-4">
              {usuarioData.direcciones?.map((direccion: Direccion, index: number) => (
                <div key={index} className="flex flex-col gap-3 mb-4 border-1 border-[#023D71] p-4 rounded-lg bg-gray-50 shadow text-gray-700">
                  <p className='flex flex-col justify-between'>
                    <strong className='font-semibold text-[14px] sm:text-[16px] lg:text-[17px]'>Dirección:</strong>
                    <span className='ml-3 text-[14px] sm:text-[15px] lg:text-[16px]'>{direccion.direccion}</span>
                  </p>
                  <p className='flex flex-col justify-between'>
                    <strong className='font-semibold text-[14px] sm:text-[16px] lg:text-[17px]'>Ciudad:</strong>
                    <span className='ml-3 text-[14px] sm:text-[15px] lg:text-[16px]'>{direccion.ciudad}</span>
                  </p>
                  <p className='flex flex-col justify-between'>
                    <strong className='font-semibold text-[14px] sm:text-[16px] lg:text-[17px]'>Departamento:</strong>
                    <span className='ml-3 text-[14px] sm:text-[15px] lg:text-[16px]'>{direccion.departamento}</span>
                  </p>
                  <p className='flex flex-col justify-between'>
                    <strong className='font-semibold text-[14px] sm:text-[16px] lg:text-[17px]'>Celular:</strong>
                    <span className='ml-3 text-[14px] sm:text-[15px] lg:text-[16px]'>{direccion.celular}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "compras" && (
          <div>
            <h3 className="font-semibold text-gray-700 text-[16px] sm:text-[18px] lg:text-xl">Mis Compras</h3>
            <div className="mt-4">
              {transacciones.length > 0 ? (
                transacciones.map((transaccion, index) => (
                  <div key={index} className="border p-4 mb-4 rounded-lg shadow text-gray-700">
                    <p className="text-sm"><strong className='font-semibold mr-2'>Fecha:</strong> {new Date(transaccion.transaccionDate).toLocaleDateString()}</p>
                    <p className="text-sm"><strong className='font-semibold mr-2'>Total:</strong>${transaccion.total}</p>
                    <p className="text-sm"><strong className='font-semibold mr-2'>Cupón de descuento:</strong>{transaccion.cupon || 'Sin cupón'}</p>

                    <p className="text-sm font-semibold mt-4">Productos:</p>
                    <ul className="list-disc list-inside text-sm ml-2">
                      {transaccion.contents?.map((item: any, i: number) => (
                        <li key={i}>
                          {item.producto?.nombre} — {item.cantidad} × ${item.precio}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>No hay compras aún.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
