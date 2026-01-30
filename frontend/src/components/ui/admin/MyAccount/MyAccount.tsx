'use client';

import MyAccountSkeleton from '../../skeletons/MyAccountSkeleton';
import ConfirmDialog from '../../dialog/ConfirmDialog';
import AddAddressDialog from '../../dialog/AddAddressDialog';

import MyAccountSidebar from '@/components/my-account/MyAccountSidebar';
import ProfileSection from '@/components/my-account/ProfileSection';
import AddressesSection from '@/components/my-account/AddressesSection';
import PurchasesSection from '@/components/my-account/PurchasesSection';

import { useMyAccount } from '@/hooks/useMyAccount';

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
  } = useMyAccount();

  if (isLoading) return <MyAccountSkeleton />;
  if (!usuarioData) return <div>No se encontraron datos del usuario.</div>;

  return (
    <div className="flex min-h-screen">
      <MyAccountSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        usuarioNombre={usuarioData.nombre}
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

      {/* Modal confirmación eliminar */}
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

      {/* Modal agregar dirección */}
      <AddAddressDialog
        open={addOpen}
        loading={savingAddress}
        onClose={closeAddDialog}
        onSubmit={handleCreateAddress}
      />
    </div>
  );
}
