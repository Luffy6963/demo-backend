import Seller from '../models/Seller.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';

export async function registerSeller(req, res) {
  const { name, email, phone, password } = req.body;
  
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const existing = await Seller.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Seller already exists with this email.' });
    }

    const hashed = await hashPassword(password);
    await Seller.create({ name, email, phone, password: hashed });

    return res.status(201).json({ message: 'Registered successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function loginSeller(req, res) {
  const { email, password } = req.body;
  
  if(!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  
  try {
    const seller = await Seller.findOne({ where: { email } });
    if(!seller) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    
    // console.log(seller.password, "seller")
    const match = await comparePassword(password, seller.password);
    if(!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    // console.log(email, password , "Email Password")

    const token = generateToken({ id: seller.id, email: seller.email });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}