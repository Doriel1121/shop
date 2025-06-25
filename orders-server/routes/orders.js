const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/orderController");

// Create new order
router.post("/", orderController.createOrder);

// Get all orders (with pagination)
router.get("/", orderController.getOrders);

// Get specific order by ID
router.get("/:id", orderController.getOrderById);

// Update order status
router.patch("/:id/status", orderController.updateOrderStatus);

module.exports = router;
