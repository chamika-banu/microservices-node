const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define(
	"Order",
	{
		orderId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		customerId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		amount: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		txnId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		tableName: "Orders",
		timestamps: false,
	}
)

module.exports = Order;
