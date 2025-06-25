const Order = require("../Models/Order");
const Joi = require("joi");

// Validation schema
const orderValidationSchema = Joi.object({
  customer: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().required(),
    address: Joi.string().trim().min(10).max(200).required(),
  }).required(),
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        name: Joi.string().trim().min(1).max(100).required(),
        price: Joi.number().min(0).required(),
        quantity: Joi.number().integer().min(1).required(),
        totalPrice: Joi.number().min(0).required(),
        categoryId: Joi.number().integer().required(),
        categoryName: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
  totalAmount: Joi.number().min(0).required(),
  orderDate: Joi.date().iso(),
});

class OrderController {
  async createOrder(req, res) {
    try {
      // Validate request data
      const { error, value } = orderValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: "Validation error",
          details: error.details.map((detail) => detail.message),
        });
      }

      // Verify total amount calculation
      const calculatedTotal = value.items.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      if (Math.abs(calculatedTotal - value.totalAmount) > 0.01) {
        return res.status(400).json({
          message: "Total amount does not match sum of items",
        });
      }

      // Create new order
      const newOrder = new Order(value);
      const savedOrder = await newOrder.save();

      res.status(201).json({
        message: "Order created successfully",
        orderId: savedOrder._id,
        order: savedOrder,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  async getOrders(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const orders = await Order.find()
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Order.countDocuments();

      res.json({
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid order ID format",
        });
      }
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      const validStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status value",
        });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}
module.exports = new OrderController();
