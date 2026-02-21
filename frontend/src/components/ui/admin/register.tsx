'use client'
import RegisterWizard from '@/components/forms/register/RegisterWizard'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Register() {
    return (
        <main className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
            <div className="w-full max-w-3xl bg-white shadow-2xl rounded-lg p-6 md:p-10">
                <h2 className="text-center text-[20px] md:text-2xl font-bold text-gray-700 mb-6">
                    Crear cuenta
                </h2>
                <RegisterWizard />
            </div>
            {/* <ToastContainer /> */}
        </main>
    )
}
