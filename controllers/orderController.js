// server/controllers/orderController.js
import Order from '../models/Order.js';
import Delivery from '../models/Delivery.js';
import Seller from '../models/Seller.js';
// import { Order, Seller, Delivery } from '../models/index.js'; // Import models
import razorpay from '../config/razorpay.js'; // Razorpay configuration
import crypto from 'crypto'; // For signature verification
import { body } from 'express-validator';

/**
 * Middleware for validating order creation
 */
export const validateCreateOrder = [
  body('seller_id').isInt().withMessage('seller_id must be an integer.'),
  body('delivery_partner_id').isInt().withMessage('delivery_partner_id must be an integer.'),
  body('amount').isFloat({ gt: 0 }).withMessage('amount must be a positive number.'),
  body('customer_first_name').notEmpty().withMessage('customer_first_name is required.'),
  body('customer_last_name').notEmpty().withMessage('customer_last_name is required.'),
  body('customer_email').isEmail().withMessage('Invalid customer_email format.'),
  body('customer_phone').isLength({ min: 10, max: 15 }).isNumeric().withMessage('Invalid customer_phone format.')
];

/**
 * Create a new Order and automatically open Razorpay Checkout
 * Endpoint: GET /order/create-test
 */
export async function createOrder(req, res) {

  const seller_id = 2;
  const delivery_partner_id = 2;
  const amount = 100.00;
  const customer_first_name = "xyz";
  const customer_last_name = "abc";
  const customer_email = "xyz@gmail.com";
  const customer_phone = "1234567890"; 

  // const { 
  //   seller_id, 
  //   delivery_partner_id, 
  //   amount, 
  //   customer_first_name, 
  //   customer_last_name, 
  //   customer_email, 
  //   customer_phone 
  // } = req.body;
 
  console.log(
    seller_id,
    delivery_partner_id,
    amount,
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_phone
  );

  try {
    // Check if Seller exists
    
    const seller = await Seller.findByPk(seller_id);
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found.' });
    }
    

    // Check if Delivery Partner exists
    
    const deliveryPartner = await Delivery.findByPk(delivery_partner_id);
    if (!deliveryPartner) {
      return res.status(404).json({ error: 'Delivery Partner not found.' });
    }
    

    // Convert amount to smallest currency unit (e.g., paise)
    const razorpayAmount = Math.round(parseFloat(amount) * 100);

    // Create order options for Razorpay
    const options = {
      amount: razorpayAmount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(options);

    // Create Order record in the database
    await Order.create({
      seller_id,
      delivery_partner_id,
      razorpay_order_id: razorpayOrder.id,
      amount,
      currency: 'INR',
      status: 'Pending',
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone
    });

    // Automatically Open Razorpay Checkout Modal upon Page Load
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Razorpay Checkout</title>
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
          <script>
              var options = {
                  "key": "rzp_test_PW04eBFotN2esA", // Replace with your Razorpay Key ID
                  "amount": "${razorpayAmount}", // Amount in currency subunits
                  "currency": "INR",
                  "name": "Vaulcrypt",
                  "description": "Order Payment",
                  "image": "https://example.com/your_logo", // Replace with your logo URL
                  "order_id": "${razorpayOrder.id}",
                   
                  "prefill": {
                      "name": "${customer_first_name} ${customer_last_name}",
                      "email": "${customer_email}",
                      "contact": "${customer_phone}"
                  },
                  "theme": {
                      "color": "#3399cc"
                  }
              };
              var rzp1 = new Razorpay(options);
              rzp1.open();
          </script>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).send('Internal server error.');
  }
}

/**
 * Verify Razorpay Payment
 * Endpoint: POST /order/verify
 */
export async function verifyPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Validate required fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const secret = 'rzp_test_PW04eBFotN2esA';

    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is undefined.');
      return res.status(500).json({ error: 'Internal server error.' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Update order status to 'Failed'
      await Order.update({ status: 'Failed' }, { where: { razorpay_order_id } });
      return res.status(400).json({ error: 'Invalid signature.' });
    }

    // Update order status to 'Paid'
    await Order.update({ status: 'Paid' }, { where: { razorpay_order_id } });
    return res.json({ status: 'success' });
  } catch (err) {
    console.error('Error verifying payment:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

/**
 * Get All Orders or Filter by Seller ID
 * Endpoint: GET /order/all
 * Query Params: seller_id (optional), limit, page
 */
export async function getOrders(req, res) {
  const { seller_id, limit = 10, page = 1 } = req.query;

  // Parse limit and page to integers
  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);

  // Validate limit and page
  if (isNaN(parsedLimit) || parsedLimit <= 0) {
    return res.status(400).json({ error: 'Invalid limit parameter. It must be a positive integer.' });
  }

  if (isNaN(parsedPage) || parsedPage <= 0) {
    return res.status(400).json({ error: 'Invalid page parameter. It must be a positive integer.' });
  }

  try {
    const offset = (parsedPage - 1) * parsedLimit;

    const options = {
      attributes: [
        'id',
        'seller_id',
        'delivery_partner_id',
        'razorpay_order_id',
        'amount',
        'currency',
        'status',
        'created_at',
        'customer_first_name',
        'customer_last_name',
        'customer_email',
        'customer_phone'
      ],
      limit: parsedLimit,
      offset: offset,
      order: [['created_at', 'DESC']],
      
      include: [
        {
          model: Seller,
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Delivery,
          attributes: ['id', 'brand_name', 'email']
        }
      ]
    
    };

    if (seller_id) {
      options.where = {  seller_id };
      // You may want to remove or comment out usage of seller_id entirely
    }

    const { rows: orders, count: totalOrders } = await Order.findAndCountAll(options);

    const totalPages = Math.ceil(totalOrders / parsedLimit);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found.' });
    }

    return res.json({ 
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: parsedPage
      }
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}


// "handler": function (response){
 // Handle the payment verification on the backend
//  fetch('http://localhost:4000/order/verify', {
//   method: 'POST',
//   headers: {
//       'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//       razorpay_order_id: response.razorpay_order_id,
//       razorpay_payment_id: response.razorpay_payment_id,
//       razorpay_signature: response.razorpay_signature
//   })
// })
// .then(res => res.json())
// .then(data => {
//   if(data.status === 'success') {
//       alert('Payment Successful!');
//       window.location.href = '/payment-success';
//   } else {
//       alert('Payment Failed.');
//       window.location.href = '/payment-failed';
//   }
// })
// .catch(err => {
//   console.error(err);
//   alert('An error occurred.');
//   window.location.href = '/payment-error';
// });
// },