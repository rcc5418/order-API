const express = require('express');
const router = express.Router();

   /**
    * @swagger
    * /Order:
    *   get:
    *     summary: Retrieve a list of orders
    *     responses:
    *       200:
    *         description: A list of orders
    */

router.get('/Order', (req, res) => {
    res.status(200).json([{customerID: 0, items: ['BLANK'], totalAmount: 0, status: 'Processing'}]);
});

module.exports = router;
