import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || '2X4OLRNbFKbUyD4HPKkB0Mc89E8oNn5NZOfx/+aM5Ic=';

export function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}