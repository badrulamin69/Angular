const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SSLCommerzPayment = require('sslcommerz-lts');

const app = express();
const port = 3030;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SSLCommerz Credentials
const store_id = 'euroa6a088eaf095ef';
const store_passwd = 'euroa6a088eaf095ef@ssl';
const is_live = false; // true for live, false for sandbox

// Payment Initialization
app.get('/init', (req, res) => {
    // Allow passing amount and customer info via query params for demo
    const amount = req.query.amount ? Number(req.query.amount) : 100;
    const tran = req.query.tran_id || ('REF' + Date.now());
    const cus_name = req.query.name || 'Test Student';
    const cus_email = req.query.email || 'student@example.com';

    // Allow client to supply where to return after payment (useful for different dev ports)
    const returnUrl = req.query.return_url;

    const data = {
        total_amount: amount,
        currency: 'BDT',
        tran_id: tran,
        success_url: returnUrl || `http://localhost:4200/student/payment-success?tran_id=${tran}`,
        fail_url: returnUrl ? `${returnUrl}&status=fail` : `http://localhost:4200/student/payment?tran_id=${tran}&status=fail`,
        cancel_url: returnUrl ? `${returnUrl}&status=cancel` : `http://localhost:4200/student/payment?tran_id=${tran}&status=cancel`,
        ipn_url: `http://localhost:${port}/ipn`,
        shipping_method: 'Courier',
        product_name: 'Smart University Course Fee',
        product_category: 'Education',
        product_profile: 'general',
        cus_name: cus_name,
        cus_email: cus_email,
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Test Student',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;
        if (GatewayPageURL) {
            res.redirect(GatewayPageURL);
            console.log('Redirecting to: ', GatewayPageURL);
        } else {
            res.status(400).json({
                message: "SSLCommerz init failed",
                response: apiResponse
            });
        }
    }).catch(error => {
        console.error('SSLCommerz Error:', error);
        res.status(500).json({ error: error.message });
    });
});

// Success Route
app.post('/success', (req, res) => {
    console.log('Payment Successful:', req.body);
    // In a real app, you would verify the transaction here and update your database
    res.status(200).send(`
        <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
            <h1 style="color: #22c55e;">Payment Successful!</h1>
            <p>Transaction ID: ${req.body.tran_id}</p>
            <p>Amount: ${req.body.amount} ${req.body.currency}</p>
            <a href="http://localhost:4200" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Back to University Portal</a>
        </div>
    `);
});

// Fail Route
app.post('/fail', (req, res) => {
    console.log('Payment Failed:', req.body);
    res.status(200).send(`
        <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
            <h1 style="color: #ef4444;">Payment Failed!</h1>
            <p>Transaction ID: ${req.body.tran_id}</p>
            <a href="http://localhost:4200" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Try Again</a>
        </div>
    `);
});

// Cancel Route
app.post('/cancel', (req, res) => {
    console.log('Payment Cancelled:', req.body);
    res.status(200).send(`
        <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
            <h1 style="color: #f59e0b;">Payment Cancelled</h1>
            <a href="http://localhost:4200" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Back to Portal</a>
        </div>
    `);
});

// IPN Route (Instant Payment Notification)
app.post('/ipn', (req, res) => {
    console.log('IPN Received:', req.body);
    res.status(200).json(req.body);
});

app.listen(port, () => {
    console.log(`Payment server listening at http://localhost:${port}`);
    console.log(`Payment init URL: http://localhost:${port}/init`);
});
