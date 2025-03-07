const express = require('express');
const router = express.Router();

   /**
    * @swagger
    * /Customer:
    *   get:
    *     summary: Retrieve a list of customers
    *     responses:
    *       200:
    *         description: A list of customers
    *       500:
    *         description: error message  
    *               
    */

router.get('/Customer', (req, res) => {
    res.status(200).json([{ name: 'John Doe', email: 'johndoe@email.com'}]);
});

module.exports = router;