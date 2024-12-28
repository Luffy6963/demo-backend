// const razorpay = new Razorpay({
//     key_id:"rzp_live_BKzqi08Q1UNgKj",
//     key_secret:"FTiyrKrTsCKqkCe1TQ3Y7FK9"
// });
// const razorpay = new Razorpay({
//     key_id:"rzp_test_PW04eBFotN2esA",
//     key_secret:"uxxPFHrSI8e2PgCFSyLqtxw5"
//   });

import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import app from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Export a serverless function handler
export default async (req, res) => {
  try {
    console.log('Incoming Request:', req.method, req.url);
    app(req, res); // Pass the request and response to the Express app
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).send('Internal Server Error');
  }
};
