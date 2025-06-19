Razorpay Backend Template with MongoDB and PostgreSQL Support

This repository provides a simple backend template for integrating Razorpay payment gateway into any website, with support for both MongoDB and PostgreSQL databases. Built using Node.js and Express, it uses REST APIs to handle payment creation, verification, and data storage, requiring minimal alterations for integration.

Features:

Razorpay Integration: Create and verify payments using Razorpay's API.
Dual Database Support: Configurable for MongoDB or PostgreSQL to store payment records.

REST API: Endpoints for payment creation, verification, and transaction history.

Secure Payment Handling: Server-side payment verification for enhanced security.

Environment Configuration: Uses .env for managing API keys and database credentials.

Minimal Alteration: Easily adaptable to any website with basic frontend adjustments.
Prerequisites





Node.js (v16 or higher)
Razorpay account with API keys



MongoDB or PostgreSQL installed locally or hosted (e.g., MongoDB Atlas, Supabase, etc.)
Basic knowledge of JavaScript, Express.js, and REST APIs
Setup Instructions





Clone the Repository:
git clone https://github.com/Luffy6963/demo-backend.git
cd demo-backend



Install Dependencies:
npm install

Configure Environment Variables:
Create a .env file in the root directory.


Add your Razorpay API keys and database credentials:

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
PORT=5000
# MongoDB (uncomment if using MongoDB)
MONGO_URI=mongodb://localhost:27017/razorpay_db
# PostgreSQL (uncomment if using PostgreSQL)
# PG_HOST=localhost
# PG_PORT=5432
# PG_USER=your_username
# PG_PASSWORD=your_password
# PG_DATABASE=razorpay_db



Choose Database:
In server.js, uncomment the MongoDB or PostgreSQL connection code based on your preference.
Ensure the respective database is running and credentials are correct.



Run the Server:
npm start
The server will run on http://localhost:5000.
REST API Endpoints





POST /api/create-order:
Request body: { amount: <amount-in-paise>, currency: "INR" }
Response: { id: <order_id>, amount: <amount>, currency: "INR" }
Creates a Razorpay order and stores it in the chosen database.



POST /api/verify-payment:
Request body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
Response: { message: "Payment verified successfully" } or error
Verifies payment and logs transaction details.



GET /api/transactions:
Response: List of stored transactions (requires authentication, if implemented).
Retrieves payment history from the database.
Integration Steps


Frontend Setup:

Include the Razorpay checkout script in your website's HTML:
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
Make a POST request to /api/create-order to generate a payment order.



Example Frontend Code:

<button onclick="initiatePayment()">Pay Now</button>
<script>
async function initiatePayment() {
  const response = await fetch('http://localhost:5000/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 50000, currency: 'INR' }) // 500 INR
  });
  const order = await response.json();
  
  const options = {
    key: '<your-razorpay-key-id>',
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    handler: async function (response) {
      const verify = await fetch('http://localhost:5000/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
      });
      const result = await verify.json();
      alert(result.message);
    }
  };
  const rzp = new Razorpay(options);
  rzp.open();
}
</script>


Alterations:

Modify server.js to adjust order amount logic, add custom fields, or extend API endpoints.
Update database schema in models/ (if applicable) to store additional payment metadata.
Adjust frontend fetch URLs to match your website’s domain or hosting setup.


Dependencies

express: For creating the REST API server.
razorpay: Official Razorpay Node.js SDK.
mongoose: For MongoDB integration (if used).
pg: For PostgreSQL integration (if used).
dotenv: For environment variable management.
crypto: For payment signature verification.

Notes

Replace <your-razorpay-key-id> in the frontend with your actual Razorpay key.
Ensure HTTPS in production for Razorpay compatibility.
Test payments in Razorpay’s test mode before deploying to production.
For MongoDB, use a service like MongoDB Atlas for cloud hosting.
For PostgreSQL, services like Supabase or AWS RDS can be used.

Contributing

Contributions are welcome! Submit issues or pull requests for bug fixes or enhancements.

License

MIT License
