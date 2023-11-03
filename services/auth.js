import bcrypt from "bcrypt";

const createHash = async (password) => {
  // Primero definirá las rondas de mezcla que hay con el password

  const salts = await bcrypt.genSalt(10);

  // Ahora sí, hasheamos
  return bcrypt.hash(password, salts);
};
const validatePassword = async (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};
export default {
  createHash,
  validatePassword
};
