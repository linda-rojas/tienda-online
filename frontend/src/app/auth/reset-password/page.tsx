"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { resetPassword } from "@/services/passwordReset/passwordReset.service";
import { validateNewPassword } from "@/services/passwordReset/validation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function ResetPasswordPage() {
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const t = params.get("token");

        if (!t) {
            toast.error("Token no encontrado. Solicita un nuevo enlace.");
            window.location.href = "/admin/auth/forgot-password";
            return;
        }

        setToken(t);
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setConfirmError("");

        const passErr = validateNewPassword(password);
        if (passErr) {
            setPasswordError(passErr);
            return;
        }

        if (password !== confirm) {
            setConfirmError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        const { success, data, error } = await resetPassword(token, password);
        setLoading(false);

        if (!success) {
            toast.error(error || "Token inválido o expirado");
            //  si token ya no sirve → mandarlo a pedir otro
            setTimeout(() => {
                window.location.href = "/auth/forgot-password";
            }, 1200);
            return;
        }

        toast.success(data || "Contraseña actualizada correctamente", {
            autoClose: 3000,
            onClose: () => {
                window.location.href = "/admin/login";
            },
        });
    };

    return (
        <div className="flex justify-center p-4 items-center m-6 bg-gray-100">
            <div className="w-full max-w-lg p-4 sm:p-8 bg-white shadow-xl rounded-lg">
                <h2 className="text-[20px] sm:text-2xl font-bold text-center mb-6 text-gray-600">
                    Nueva contraseña
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[14px] sm:text-[17px] font-semibold text-gray-500">
                            Nueva contraseña
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (passwordError) setPasswordError("");
                                }}
                                className={`w-full p-2 pr-12 border text-gray-500 ${passwordError ? "border-red-500" : "border-gray-300"
                                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition bg-transparent border-0 outline-none"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? (
                                    <AiOutlineEye className="text-xl" />
                                ) : (
                                    <AiOutlineEyeInvisible className="text-xl" />
                                )}
                            </button>
                        </div>

                        {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}
                    </div>

                    <div>
                        <label className="block text-[14px] sm:text-[17px] font-semibold text-gray-500">
                            Confirmar contraseña
                        </label>

                        <input
                            type={showPassword ? "text" : "password"}
                            value={confirm}
                            onChange={(e) => {
                                setConfirm(e.target.value);
                                if (confirmError) setConfirmError("");
                            }}
                            className={`w-full p-2 border text-gray-500 ${confirmError ? "border-red-500" : "border-gray-300"
                                } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                            required
                        />

                        {confirmError && <div className="text-red-500 text-sm mt-1">{confirmError}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#3399f2] to-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Guardando..." : "Guardar nueva contraseña"}
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
