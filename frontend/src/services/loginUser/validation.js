export const validateEmail = (email) => {
  if (!email) return 'Correo electrónico es obligatorio';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Contraseña es obligatoria';
  return '';
};
