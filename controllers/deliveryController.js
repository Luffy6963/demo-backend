// import { Delivery } from '../models/index.js';
import Delivery from "../models/Delivery.js";

// Create a new Delivery Partner
export async function createDelivery(req, res) {
  const { brand_name, email } = req.body;

  // Validate input
  if (!brand_name || !email) {
    return res.status(400).json({ error: 'Both brand_name and email are required.' });
  }

  try {
    // Check for duplicate email
    const existingDelivery = await Delivery.findOne({ where: { email } });
    if (existingDelivery) {
      return res.status(409).json({ error: 'A delivery partner with this email already exists.' });
    }

    // Create new delivery partner
    const delivery = await Delivery.create({ brand_name, email });
    console.log('New Delivery Partner Created:', delivery);
    res.status(201).json({ delivery });
  } catch (err) {
    console.error('Error creating delivery partner:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}

// Get all Delivery Partners
export async function getDeliveries(req, res) {
  try {
    const deliveries = await Delivery.findAll();
    console.log(`Fetched ${deliveries.length} delivery partners.`);
    res.json({ deliveries });
  } catch (err) {
    console.error('Error fetching deliveries:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}
