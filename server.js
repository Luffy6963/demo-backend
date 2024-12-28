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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import app from './app.js';

// Add a new route for the Hello World response
app.get('/', (req, res) => {
  res.send('Welcome, your app is working well');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
