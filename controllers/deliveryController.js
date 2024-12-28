// server/controllers/deliveryController.js

import { Delivery } from '../models/index.js';

// Create a new Delivery Partner
export async function createDelivery(req, res) {
  const { brand_name, email } = req.body;

  if (!brand_name || !email) {
    return res.status(400).json({ error: 'brand_name and email are required.' });
  }

  try {
    const delivery = await Delivery.create({ brand_name, email });
    res.status(201).json({ delivery });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// Get all Delivery Partners
export async function getDeliveries(req, res) {
  try {
    const deliveries = await Delivery.findAll();
    res.json({ deliveries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// Additional CRUD functions (update, delete) can be added similarly