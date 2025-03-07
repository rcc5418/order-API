const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// MongoDB Connection
mongoose.connect('mongodb://localhost/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const app = express();
const router = express.Router();
const port = 3000;

// Middleware
app.use(bodyParser.json());

let customers = [];
let orders = [];
let payments = [];

// Helper function to simulate async delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Create a new customer
const Customer = require("./models/Customer");


   /**
    * @swagger
    * /customer:
    *   post:
    *     summary: Adds data about a new customer
    *     responses:
    *       201:
    *         description: A messaage with the JSON that was posted
    *       500:
    *         description: error message  
    *               
    */
app.post("/customers", async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: "Error creating customer", error });
    }
});


// Create a new order (Simulated Processing Delay)
const Order = require("./models/Order");

   /**
    * @swagger
    * /orders:
    *   post:
    *     summary: Adds data about a new order
    *     responses:
    *       201:
    *         description: A messaage with the JSON that was posted
    *       500:
    *         description: error message  
    *               
    */
app.post("/orders", async (req, res) => {
    try {
        const { customerId, items, totalAmount } = req.body;
        const order = new Order({ customerId, items, totalAmount });

        await order.save();
        setTimeout(async () => {
            try {
                order.status = "Confirmed";
                await order.save();
                console.log("Order status updated to Confirmed");
            } catch (err) {
                console.error("Failed to update order status:", err);
            }
        }, 5000);
        

        res.status(201).json({ message: "Order is being processed", order });
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error });
    }
});


// Cancel an order
   /**
    * @swagger
    * /orders/:id:
    *   delete:
    *     summary: Deletes the data of an order pertaining to a particular id
    *     responses:
    *       200:
    *         description: A messaage confirming data deletion
    *       500:
    *         description: error message  
    *               
    */
app.delete("/orders/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json({ message: "Order canceled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error canceling order", error });
    }
});


// Submit a payment
const Payment = require("./models/Payment");


   /**
    * @swagger
    * /payments:
    *   post:
    *     summary: Adds data about a new payment method
    *     responses:
    *       201:
    *         description: A messaage with confirmation of succesful payment and the JSON that was posted
    *       400:
    *         description: Error message explaining invalid data format.  
    *       500:
    *         description: error message  
    *               
    */
app.post("/payments", async (req, res) => {
    try {
        const { orderId, amount, paymentMethod } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid order ID format" });
        }

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const payment = new Payment({ orderId, amount, paymentMethod });
        await payment.save();

        res.status(201).json({ message: "Payment successful", payment });
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ message: "Error processing payment", error });
    }
});

// Retrieve all customers
   /**
    * @swagger
    * /customers:
    *   get:
    *     summary: Retrieves all customer info
    *     responses:
    *       200:
    *         description: All the customer data that has been entered.
    *       500:
    *         description: error message  
    *               
    */
app.get("/customers", async (req, res) => {
    try {
        const customers = await Customer.find(); // Fetch all customers from MongoDB
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving customers", error });
    }
});


// Retrieve order details (specific order)
   /**
    * @swagger
    * /orders/:id:
    *   get:
    *     summary: Retrieves the order info for a specific order
    *     responses:
    *       200:
    *         description: The order data for the specified order
    *       404:
    *         description: An error message explaining how the order cannot be found  
    *       500:
    *         description: error message  
    *               
    */
app.get("/orders/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("customerId");
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving order", error });
    }
});

// Retrieve all orders
   /**
    * @swagger
    * /orders:
    *   get:
    *     summary: Retrieves all the order data that has been entered
    *     responses:
    *       200:
    *         description: All the order data that has been entered.
    *       500:
    *         description: error message  
    *               
    */
app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().populate("customerId"); // Fetch all orders and populate customer data
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving orders", error });
    }
});


// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation using Swagger',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
   components: {
     securitySchemes: {
         bearerAuth: {
             type: 'http',
             scheme: 'bearer',
             bearerFormat: 'JWT', 
         },
     },
 },
    },
    apis: ['./server.js'], // Path to your API docs, but we'll just path it here with simple documentation for now.
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// const customerRoutes = require('./routes/CustomerRT');
// app.use('/api', customerRoutes);
// const orderRoutes = require('./routes/Order');
// app.use('/api', orderRoutes);
// const paymentRoutes = require('./routes/Payment');
// app.use('/api', paymentRoutes);

module.exports = app;

// Start server
app.listen(port, () => {
    console.log(`Order API running at http://localhost:${port}`);
});
