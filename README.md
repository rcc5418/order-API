# Order API

## Overview

This is a simple Node.js and Express API for managing customers, orders, and payments, using MongoDB as the database.

### Dependencies
These must be installed in order for this API to function correctly

- [Node.js](https://nodejs.org/) 
- [MongoDB](https://www.mongodb.com/try/download/community) (Ensure MongoDB is running)

## *API Endpoints*

## Customers

### POST /customers

-Creates a customer

Request body (example):
```
{
  "name": "John Doe",
  "email": "johndoe@example.com",
}
```
Response:
```
{
  "_id": "650f0fbb87e5b92f6c3fbd13",
  "name": "John Doe",
  "email": "johndoe@example.com",
}
```

### GET /customers

-Retrieves all customer data

Response:
```
[
  {
    "_id": "650f0fbb87e5b92f6c3fbd13",
    "name": "John Doe",
    "email": "johndoe@example.com",
  }
]
```

## Orders

### POST /orders

-Creates an order

Request Body (example):

```
{
  "customerId": "650f0fbb87e5b92f6c3fbd13",
  "items": ["Pair of shoes", "Fancy coat"],
  "totalAmount": 99.99
}
```

Response:
```
{
  "message": "Order is being processed",
  "order": {
    "_id": "650f0fbb87e5b92f6c3fbd14",
    "customerId": "650f0fbb87e5b92f6c3fbd13",
    "items": ["Pair of shoes", "Fancy coat"],
    "totalAmount": 99.99,
    "status": "Pending"
  }
}
```

### GET /orders

-Retrieves all order data

Response
```
[
  {
    "_id": "650f0fbb87e5b92f6c3fbd14",
    "customerId": "650f0fbb87e5b92f6c3fbd13",
    "items": ["Pair of shoes", "Fancy coat"],
    "totalAmount": 99.99,
    "status": "Confirmed"
  }
]
```

### GET /orders/:id

-Retrieves order data for a specific order

Response
```
{
    "_id": "<ID_HERE>",
    "customerId": {
        "_id": "650f0fbb87e5b92f6c3fbd13",
        "name": "John Doe",
        "email": "johndoe@example.com",
        "__v": 0
    },
    "items": ["Pair of shoes", "Fancy coat"],
    "totalAmount": 99.99,
    "status": "Confirmed",
    "__v": 0
}
```

### DELETE /orders/:id

-Deletes the order data for a specific order

## Payments

### POST /payments

Request Body (example):
```
{
  "orderId": "650f0fbb87e5b92f6c3fbd14",
  "amount": 99.99,
  "paymentMethod": "Credit Card"
}
```

Response:
```
{
  "message": "Payment successful",
  "payment": {
    "_id": "650f0fbb87e5b92f6c3fbd15",
    "orderId": "650f0fbb87e5b92f6c3fbd14",
    "amount": 99.99,
    "paymentMethod": "Credit Card"
  }
}
```

### Swagger
Swagger documentation can be found at ```http://localhost:3000/api-docs```