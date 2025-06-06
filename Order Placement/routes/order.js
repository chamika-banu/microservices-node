const express = require("express")
const router = express.Router()
const Order = require("../models/order")
const axios = require("axios")

// Create an order
router.post("/addOrder", async (req, res) => {
	try {
		const { orderId, customerId, amount, status, txnId } = req.body

		// Basic validation
		if (!orderId || !customerId || !amount || !status || !txnId) {
			return res.status(400).json({ error: "Missing required fields" })
		}

		// Create order without timestamps, let ORM or DB default handle them
		const order = await Order.create({
			orderId,
			customerId,
			amount,
			status,
			txnId,
		})

		res.status(201).json({ message: "Order created successfully", order })
	} catch (error) {
		console.error("Error creating order:", error.message)
		res
			.status(500)
			.json({ error: "Unable to create the order", details: error.message })
	}
})

// Get all orders
router.get("/orders", async (req, res) => {
	try {
		const orders = await Order.findAll()

		res.json(orders)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Server error" })
	}
})

// Get order by ID
router.get("/orders/:id", async (req, res) => {
	try {
		const order = await Order.findByPk(req.params.id)

		if (!order) {
			return res.status(404).json({ error: "Order not found" })
		}

		res.json(order)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Server error" })
	}
})

// Delete order by ID
router.delete("/orders/:id", async (req, res) => {
	try {
		const order = await Order.findByPk(req.params.id)

		if (!order) {
			return res.status(404).json({ error: "Order not found" })
		}

		await order.destroy()
		res.status(200).json({ message: "Order deleted successfully" })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Server error" })
	}
})

// Get user information by user ID from User Management microservice
router.get("/getUserInfo/:userId", async (req, res) => {
	try {
		const userId = req.params.userId

		const userManagementURL = "http://localhost:8074/users/" + userId
		const response = await axios.get(userManagementURL)

		if (response.status === 200) {
			const userInfo = response.data
			res.json(userInfo)
		} else {
			res
				.status(response.status)
				.json({ error: "Error retrieving user information" })
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Server error" })
	}
})

module.exports = router
