"use client"
import { useState } from 'react'
import { FaUserAlt, FaLock } from 'react-icons/fa'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email:', email, 'Password:', password)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <div className="relative mt-2">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaUserAlt className="absolute right-3 top-2 text-gray-400" />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative mt-2">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaLock className="absolute right-3 top-2 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/register" className="text-blue-500 hover:text-blue-700">
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>
      </div>
    </div>
  )
}
