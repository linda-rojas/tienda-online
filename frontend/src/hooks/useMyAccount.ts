'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import type { ActiveTab, Direccion, ProfileForm, ProfileTouched, Transaccion } from '@/types/my-account';
import { getProfileErrors } from '@/utils/profileValidation';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useMyAccount = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('perfil');
    const [usuarioData, setUsuarioData] = useState<any>(null);
    const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // delete address
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [direccionToDelete, setDireccionToDelete] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // add address
    const [addOpen, setAddOpen] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);

    // profile edit
    const [editingProfile, setEditingProfile] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);

    const [profileForm, setProfileForm] = useState<ProfileForm>({
        nombre: '',
        apellidos: '',
        correo: '',
        celular: '',
    });

    const [profileTouched, setProfileTouched] = useState<ProfileTouched>({
        nombre: false,
        apellidos: false,
        correo: false,
        celular: false,
    });

    // ✅ Validación memoizada
    const profileErrors = useMemo(() => getProfileErrors(profileForm), [profileForm]);
    const profileIsValid = useMemo(() => Object.keys(profileErrors).length === 0, [profileErrors]);

    useEffect(() => {
        const fetchUsuarioData = async () => {
            try {
                const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

                if (!usuario || !usuario.id) {
                    window.location.href = '/admin/login';
                    return;
                }

                const role =
                    typeof usuario.role === 'string'
                        ? usuario.role.toLowerCase()
                        : usuario.role?.nombre?.toLowerCase();

                if (role === 'administrador') {
                    window.location.href = '/admin/sales';
                    return;
                }

                const response = await fetch(`${API_URL}/usuarios/${usuario.id}`);
                const data = await response.json();

                if (response.ok) {
                    setUsuarioData(data);

                    const resTransacciones = await fetch(`${API_URL}/transacciones`);
                    const dataTransacciones = await resTransacciones.json();

                    const transaccionesDelUsuario = (dataTransacciones || []).filter(
                        (t: any) => t.usuario?.id === usuario.id
                    );

                    setTransacciones(transaccionesDelUsuario);
                } else {
                    toast.error('Error al cargar los datos del usuario', { position: 'top-right', autoClose: 3000 });
                }
            } catch (error) {
                console.log('Error fetching usuario data:', error);
                toast.error('Hubo un problema al cargar los datos del usuario', { position: 'top-right', autoClose: 3000 });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsuarioData();
    }, []);

    // ===== Direcciones =====
    const openDeleteDialog = (direccionId: number) => {
        setDireccionToDelete(direccionId);
        setConfirmOpen(true);
    };

    const closeDeleteDialog = () => {
        setConfirmOpen(false);
        setDireccionToDelete(null);
    };

    const openAddDialog = () => setAddOpen(true);
    const closeAddDialog = () => setAddOpen(false);

    const handleConfirmDelete = async () => {
        if (!direccionToDelete) return;

        try {
            setDeletingId(direccionToDelete);

            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/direcciones/${direccionToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!res.ok) {
                toast.error('No se pudo eliminar la dirección', { position: 'top-right', autoClose: 3000 });
                return;
            }

            setUsuarioData((prev: any) => ({
                ...prev,
                direcciones: (prev?.direcciones ?? []).filter((d: Direccion) => d.id !== direccionToDelete),
            }));

            toast.success('Dirección eliminada correctamente', { position: 'top-right', autoClose: 2500 });
            closeDeleteDialog();
        } catch (e) {
            console.error(e);
            toast.error('Ocurrió un error al eliminar la dirección', { position: 'top-right', autoClose: 3000 });
        } finally {
            setDeletingId(null);
        }
    };

    const handleCreateAddress = async (payload: {
        direccion: string;
        ciudad: string;
        departamento: string;
        celular: string;
    }) => {
        try {
            setSavingAddress(true);

            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/direcciones`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                toast.error('No se pudo agregar la dirección', { position: 'top-right', autoClose: 3000 });
                return;
            }

            const created = await res.json();

            setUsuarioData((prev: any) => ({
                ...prev,
                direcciones: [created, ...(prev?.direcciones ?? [])],
            }));

            toast.success('Dirección agregada correctamente', { position: 'top-right', autoClose: 2500 });
            closeAddDialog();
        } catch (e) {
            console.error(e);
            toast.error('Ocurrió un error al agregar la dirección', { position: 'top-right', autoClose: 3000 });
        } finally {
            setSavingAddress(false);
        }
    };

    // ===== Perfil =====
    const openEditProfile = () => {
        setEditingProfile(true);
        setProfileTouched({ nombre: false, apellidos: false, correo: false, celular: false });
        setProfileForm({
            nombre: usuarioData?.nombre ?? '',
            apellidos: usuarioData?.apellidos ?? '',
            correo: usuarioData?.correo ?? '',
            celular: usuarioData?.celular ?? '',
        });
    };

    const cancelEditProfile = () => {
        setEditingProfile(false);
        setProfileTouched({ nombre: false, apellidos: false, correo: false, celular: false });
    };

    const handleSaveProfile = async () => {
        try {
            setProfileTouched({ nombre: true, apellidos: true, correo: true, celular: true });
            if (!profileIsValid) return;

            setSavingProfile(true);

            const token = localStorage.getItem('token');
            const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

            const res = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    nombre: profileForm.nombre.trim(),
                    apellidos: profileForm.apellidos.trim(),
                    correo: profileForm.correo.trim(),
                    celular: profileForm.celular.trim(),
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                const msg = data?.message || data?.error || 'No se pudo actualizar el perfil. Verifica los datos.';
                toast.error(msg, { position: 'top-right', autoClose: 3000 });
                return;
            }

            setUsuarioData((prev: any) => ({
                ...prev,
                ...data,
            }));

            toast.success('Perfil actualizado correctamente', { position: 'top-right', autoClose: 2500 });
            setEditingProfile(false);
        } catch (e) {
            console.error(e);
            toast.error('Ocurrió un error al actualizar el perfil', { position: 'top-right', autoClose: 3000 });
        } finally {
            setSavingProfile(false);
        }
    };

    const direccionSeleccionada: Direccion | undefined = usuarioData?.direcciones?.find(
        (d: Direccion) => d.id === direccionToDelete
    );

    return {
        // state
        activeTab,
        usuarioData,
        transacciones,
        isLoading,

        // modals
        confirmOpen,
        addOpen,
        deletingId,
        savingAddress,

        // profile
        editingProfile,
        savingProfile,
        profileForm,
        profileTouched,
        profileErrors,
        profileIsValid,

        // computed
        direccionSeleccionada,

        // actions
        setActiveTab,
        setUsuarioData,

        setProfileForm,
        setProfileTouched,

        openDeleteDialog,
        closeDeleteDialog,
        openAddDialog,
        closeAddDialog,

        openEditProfile,
        cancelEditProfile,
        handleConfirmDelete,
        handleCreateAddress,
        handleSaveProfile,
    };
};
