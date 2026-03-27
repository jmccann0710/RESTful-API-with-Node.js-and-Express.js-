# Order Management API

## Overview
This project is a RESTful API built using Node.js, Express.js, and SQLite. It allows users to create, retrieve, update, and delete orders.

## Technologies Used
- Node.js
- Express.js
- SQLite

## Setup Instructions

1. Install dependencies:
npm install
3. Start the server:
npm run dev
5. Open in browser:
http://localhost:3000


## API Endpoints

### Create Order
POST /orders

### Get All Orders
GET /orders

### Get Order by ID
GET /orders/:id

### Update Order Status
PATCH /orders/:id

### Delete Order
DELETE /orders/:id

## Testing
All endpoints were tested using Postman. The Postman collection is included in this repository.
