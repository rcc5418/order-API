const express = require('express');
const router = express.Router();

   /**
    * @swagger
    * /Payment:
    *   post:
    *     summary: adds a payment method to an order
    *     responses:
    *       201:
    *         description: A message confirming succesful payment
    */

router.get('/Payment', (req, res) => {
    res.status(201).json([{orderID: 0, amount: 0, paymentMethod: "Cash", status: "Paid"}]);
});

module.exports = router;
