export const validatePassword = async (password: string, hash: string) => {
  return await Bun.password.verify(password, hash);
};
