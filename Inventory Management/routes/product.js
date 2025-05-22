const express = require("express")
const router = express.Router()
const Product = require("../models/Product")
const axios = require("axios")

// Create a new product
router.post("/addProduct", async (req, res) => {
	try {
		const {
			name,
			desc,
			banner,
			type,
			unit,
			price,
			available,
			supplier,
			messageId,
			eventTimestamp,
		} = req.body

		console.log("Request body:", req.body)

		if (
			!name ||
			typeof price !== "number" ||
			typeof unit !== "number" ||
			typeof available !== "boolean"
		) {
			return res
				.status(400)
				.json({ error: "Invalid or missing required fields" })
		}

		const newProduct = new Product({
			name,
			desc,
			banner,
			type,
			unit,
			price,
			available,
			supplier,
			messageId,
			eventTimestamp: eventTimestamp ? new Date(eventTimestamp) : undefined,
		})

		const savedProduct = await newProduct.save()

		const orderData = {
			orderId: "ORDER123",
			customerId: "CUSTOMER123",
			amount: price * unit,
			status: "PENDING",
			txnId: "TXN123",
		}		

		const orderResponse = await axios.post(
			"http://localhost:8072/order/addOrder",
			orderData
		)

		if (orderResponse.status === 201) {
			return res.status(201).json(savedProduct)
		} else {
			// Consider rollback: delete savedProduct if order creation fails
			await Product.findByIdAndDelete(savedProduct._id)
			return res.status(500).json({ error: "Unable to create the order" })
		}
	} catch (error) {
		console.error("Error creating product:", error)
		res.status(500).json({ error: "Unable to create the product" })
	}
})

// Get all products
router.get("/", async (req, res) => {
	try {
		const products = await Product.find()
		res.json(products)
	} catch (error) {
		res.status(500).json({ error: "Unable to fetch products" })
	}
})

// Get a specific product by ID
router.get("/:productId", async (req, res) => {
	try {
		const product = await Product.findById(req.params.productId)
		if (!product) {
			return res.status(404).json({ error: "Product not found" })
		}
		res.json(product)
	} catch (error) {
		res.status(500).json({ error: "Unable to fetch the product" })
	}
})

// Update a specific product by ID
router.put("/:productId", async (req, res) => {
	try {
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.productId,
			req.body,
			{ new: true }
		)
		if (!updatedProduct) {
			return res.status(404).json({ error: "Product not found" })
		}

		res.json(updatedProduct)
	} catch (error) {
		res.status(500).json({ error: "Unable to update the product" })
	}
})

// Delete a specific product by ID
router.delete("/:productId", async (req, res) => {
	try {
		const deletedProduct = await Product.findByIdAndRemove(req.params.productId)
		if (!deletedProduct) {
			return res.status(404).json({ error: "Product not found" })
		}
		res.json({ message: "Product deleted successfully" })
	} catch (error) {
		console.error("Delete product error:", error) 
		res.status(500).json({ error: "Unable to delete the product" })
	}
})


module.exports = router
