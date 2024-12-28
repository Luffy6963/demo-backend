import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

export async function hashPassword(plainTextPassword) {
  return await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
}

export async function comparePassword(plainTextPassword, hash) {
  return await bcrypt.compare(plainTextPassword, hash);
}