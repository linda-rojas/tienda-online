'use client';

import MyAccountSkeleton from '../../skeletons/MyAccountSkeleton';
import ConfirmDialog from '../../dialog/ConfirmDialog';
import AddAddressDialog from '../../dialog/AddAddressDialog';

import MyAccountSidebar from '@/components/my-account/MyAccountSidebar';
import ProfileSection from '@/components/my-account/ProfileSection';
import AddressesSection from '@/components/my-account/AddressesSection';
import PurchasesSection from '@/components/my-account/PurchasesSection';

import { useMyAccount } from '@/hooks/useMyAccount';
import { useState } from 'react';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function MyAccount() {
  const {
    activeTab,
    usuarioData,
    transacciones,
    isLoading,

    confirmOpen,
    addOpen,
    deletingId,
    savingAddress,

    direccionSeleccionada,

    editingProfile,
    savingProfile,
    profileForm,
    profileTouched,
    profileErrors,
    profileIsValid,

    setActiveTab,
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

    setUsuarioData,
  } = useMyAccount();

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleUploadAvatar = async (file: File) => {
    try {
      setUploadingAvatar(true);

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Debes iniciar sesión');
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (Date.now() > payload.exp * 1000) {
          localStorage.removeItem('usuario');
          localStorage.removeItem('token');
          toast.warning('Tu sesión expiró. Inicia sesión de nuevo.');
          window.location.href = '/admin/login';
          return;
        }
      } catch {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        toast.error('Token inválido. Inicia sesión de nuevo.');
        window.location.href = '/admin/login';
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('El archivo debe ser una imagen');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Máximo 2MB');
        return;
      }

      const form = new FormData();
      form.append('avatar', file);

      const res = await fetch(`${API_URL}/usuarios/avatar`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.message || 'No se pudo actualizar el avatar');
        return;
      }

      setUsuarioData((prev: any) => ({
        ...prev,
        avatarUrl: data.avatarUrl,
        avatarPublicId: data.avatarPublicId,
      }));

      const storedUser = JSON.parse(localStorage.getItem('usuario') || '{}');
      localStorage.setItem(
        'usuario',
        JSON.stringify({
          ...storedUser,
          avatarUrl: data.avatarUrl,
          avatarPublicId: data.avatarPublicId,
        }),
      );

      toast.success('Foto de perfil actualizada');
    } catch (e) {
      console.error(e);
      toast.error('Error subiendo la foto');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (isLoading) return <MyAccountSkeleton />;
  if (!usuarioData) return <div>No se encontraron datos del usuario.</div>;

  return (
    <div className="flex min-h-screen">
      <MyAccountSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        usuarioNombre={usuarioData.nombre}
        avatarUrl={usuarioData?.avatarUrl}
        uploadingAvatar={uploadingAvatar}
        onUploadAvatar={handleUploadAvatar}
      />

      <div className="w-3/4 p-3 sm:p-6 lg:p-6 bg-gray-100">
        {activeTab === 'perfil' && (
          <ProfileSection
            usuarioData={usuarioData}
            editingProfile={editingProfile}
            savingProfile={savingProfile}
            profileForm={profileForm}
            profileTouched={profileTouched}
            profileErrors={profileErrors}
            profileIsValid={profileIsValid}
            onOpenEdit={openEditProfile}
            onCancelEdit={cancelEditProfile}
            onSave={handleSaveProfile}
            setProfileForm={setProfileForm}
            setProfileTouched={setProfileTouched}
          />
        )}

        {activeTab === 'direcciones' && (
          <AddressesSection
            usuarioData={usuarioData}
            onOpenAdd={openAddDialog}
            onOpenDelete={openDeleteDialog}
          />
        )}

        {activeTab === 'compras' && <PurchasesSection transacciones={transacciones} />}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar dirección"
        message={
          <div>
            <p className="mb-2">¿Seguro que quieres eliminar esta dirección?</p>

            {direccionSeleccionada && (
              <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                <p className="text-gray-800 font-semibold">{direccionSeleccionada.direccion}</p>
                <p className="text-gray-600">
                  {direccionSeleccionada.ciudad}, {direccionSeleccionada.departamento}
                </p>
              </div>
            )}

            <p className="text-gray-500 text-sm mt-3">Esta acción no se puede deshacer.</p>
          </div>
        }
        danger
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={deletingId !== null}
        onCancel={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

      <AddAddressDialog
        open={addOpen}
        loading={savingAddress}
        onClose={closeAddDialog}
        onSubmit={handleCreateAddress}
      />
    </div>
  );
}
