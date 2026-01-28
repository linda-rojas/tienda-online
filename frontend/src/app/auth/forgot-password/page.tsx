"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { requestPasswordReset } from "@/services/passwordReset/passwordReset.service";
import { validateEmail } from "@/services/passwordReset/validation";

export default function ForgotPasswordPage() {
    const [correo, setCorreo] = useState("");
    const [correoError, setCorreoError] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCorreoError("");

        const err = validateEmail(correo);
        if (err) {
            setCorreoError(err);
            return;
        }

        setLoading(true);
        const { success, data, error } = await requestPasswordReset(correo);
        setLoading(false);

        // por seguridad este endpoint debería siempre decir lo mismo
        if (!success) {
            toast.error(error || "No se pudo procesar la solicitud");
            return;
        }

        toast.success(
            data || "Si el correo está registrado, se enviará un enlace de recuperación",
            { autoClose: 5000 }
        );

        setCorreo("");
    };

    return (
        <div className="flex justify-center p-4 items-center m-6 bg-gray-100">
            <div className="w-full max-w-lg p-4 sm:p-8 bg-white shadow-xl rounded-lg">
                <h2 className="text-[20px] sm:text-2xl font-bold text-center mb-6 text-gray-600">
                    Restablecer contraseña
                </h2>

                <p className="text-gray-500 text-sm sm:text-base text-center mb-6">
                    Escribe tu correo y te enviaremos un enlace para recuperar tu contraseña.
                </p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[14px] sm:text-[17px] font-semibold text-gray-500">
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => {
                                setCorreo(e.target.value);
                                if (correoError) setCorreoError("");
                            }}
                            className={`w-full p-2 border text-gray-500 ${correoError ? "border-red-500" : "border-gray-300"
                                } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                            required
                        />

                        {correoError && <div className="text-red-500 text-sm mt-1">{correoError}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#3399f2] to-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Enviando..." : "Enviar enlace"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/admin/login"
                        className="text-gray-500 hover:text-gray-600 text-[14px] sm:text-[16px] font-semibold"
                    >
                        Volver al login
                    </Link>
                </div>
            </div>
        </div>
    );
}
