
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "El email es requerido";
  if (!emailRegex.test(email)) return "Por favor ingrese un email válido";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "La contraseña es requerida";
  if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
  return "";
};
