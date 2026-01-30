'use client';

import type { ProfileForm, ProfileTouched } from '@/types/my-account';

type Props = {
    usuarioData: any;
    editingProfile: boolean;
    savingProfile: boolean;

    profileForm: ProfileForm;
    profileTouched: ProfileTouched;
    profileErrors: Record<string, string>;
    profileIsValid: boolean;

    onOpenEdit: () => void;
    onCancelEdit: () => void;
    onSave: () => void;

    setProfileForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
    setProfileTouched: React.Dispatch<React.SetStateAction<ProfileTouched>>;
};

export default function ProfileSection({
    usuarioData,
    editingProfile,
    savingProfile,
    profileForm,
    profileTouched,
    profileErrors,
    profileIsValid,
    onOpenEdit,
    onCancelEdit,
    onSave,
    setProfileForm,
    setProfileTouched,
}: Props) {
    return (
        <div className="text-gray-700">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-2xl font-semibold text-[16px] sm:text-[18px] lg:text-xl">Perfil</h3>

                {!editingProfile ? (
                    <button
                        type="button"
                        onClick={onOpenEdit}
                        className="w-full sm:w-auto cursor-pointer px-3 py-2 rounded-xl bg-blue-900 text-white font-semibold text-sm transition"
                    >
                        Editar perfil
                    </button>
                ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            disabled={savingProfile}
                            className="w-full sm:w-auto cursor-pointer px-3 py-2 rounded-xl bg-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={onSave}
                            disabled={savingProfile || !profileIsValid}
                            className="w-full sm:w-auto cursor-pointer px-3 py-2 rounded-xl bg-blue-900 text-white font-semibold text-sm hover:bg-blue-950 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {savingProfile ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-4 flex flex-col gap-4 bg-gray-50 p-3 sm:p-5 lg:p-7 rounded-lg shadow">
                {/* Nombre */}
                <div className="flex flex-col mb-2">
                    <span className="font-semibold text-[14px] sm:text-[16px] lg:text-[17px]">Nombre:</span>

                    {!editingProfile ? (
                        <span className="ml-3 text-[14px] sm:text-[15px] lg:text-[16px]">{usuarioData.nombre}</span>
                    ) : (
                        <>
                            <input
                                value={profileForm.nombre}
                                onChange={(e) => setProfileForm((p) => ({ ...p, nombre: e.target.value }))}
                                onBlur={() => setProfileTouched((t) => ({ ...t, nombre: true }))}
                                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${profileTouched.nombre && profileErrors.nombre
                                        ? 'border-red-300 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                            />
                            {profileTouched.nombre && profileErrors.nombre && (
                                <p className="mt-1 text-xs text-red-600">{profileErrors.nombre}</p>
                            )}
                        </>
                    )}
                </div>

                {/* Apellidos */}
                <div className="flex flex-col mb-2">
                    <span className="font-semibold text-[14px] sm:text-[16px] lg:text-[17px]">Apellidos:</span>

                    {!editingProfile ? (
                        <span className="ml-3 text-[14px] sm:text-[15px] lg:text-[16px]">{usuarioData.apellidos}</span>
                    ) : (
                        <>
                            <input
                                value={profileForm.apellidos}
                                onChange={(e) => setProfileForm((p) => ({ ...p, apellidos: e.target.value }))}
                                onBlur={() => setProfileTouched((t) => ({ ...t, apellidos: true }))}
                                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${profileTouched.apellidos && profileErrors.apellidos
                                        ? 'border-red-300 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                            />
                            {profileTouched.apellidos && profileErrors.apellidos && (
                                <p className="mt-1 text-xs text-red-600">{profileErrors.apellidos}</p>
                            )}
                        </>
                    )}
                </div>

                {/* Correo */}
                <div className="flex flex-col mb-2">
                    <span className="font-semibold text-[14px] sm:text-[16px] lg:text-[17px]">Correo:</span>

                    {!editingProfile ? (
                        <span className="ml-3 text-[14px] sm:text-[15px] lg:text-[16px]">{usuarioData.correo}</span>
                    ) : (
                        <>
                            <input
                                value={profileForm.correo}
                                onChange={(e) => setProfileForm((p) => ({ ...p, correo: e.target.value }))}
                                onBlur={() => setProfileTouched((t) => ({ ...t, correo: true }))}
                                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${profileTouched.correo && profileErrors.correo
                                        ? 'border-red-300 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                            />
                            {profileTouched.correo && profileErrors.correo && (
                                <p className="mt-1 text-xs text-red-600">{profileErrors.correo}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">Si el correo ya existe, el backend lo va a rechazar.</p>
                        </>
                    )}
                </div>

                {/* Celular */}
                <div className="flex flex-col mb-2">
                    <span className="font-semibold text-[14px] sm:text-[16px] lg:text-[17px]">Celular:</span>

                    {!editingProfile ? (
                        <span className="ml-3 text-[14px] sm:text-[15px] lg:text-[16px]">{usuarioData.celular}</span>
                    ) : (
                        <>
                            <input
                                value={profileForm.celular}
                                onChange={(e) => {
                                    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setProfileForm((p) => ({ ...p, celular: onlyDigits }));
                                }}
                                onBlur={() => setProfileTouched((t) => ({ ...t, celular: true }))}
                                inputMode="numeric"
                                maxLength={10}
                                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${profileTouched.celular && profileErrors.celular
                                        ? 'border-red-300 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                            />
                            {profileTouched.celular && profileErrors.celular && (
                                <p className="mt-1 text-xs text-red-600">{profileErrors.celular}</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
