// Librarys
const { Router } = require('express')

// Imports
const Inventory = require('../../services/Inventory.service')
const { authenticateJWT, ValidatorRol } = require('../../middleware/validator.handler')
const entries = require('./entries.route')

// vars
const Route = Router()

// middleware Validator of credential 
const validator = [ authenticateJWT, ValidatorRol('Administrador') ]

// Import entries 
Route.use('/entry',entries)

// Routes
// Get inventory for a all product
Route.get('/all', validator, async (req, res) => {
    try {
        const inventoryService = new Inventory()
        const result = await inventoryService.findAll();

        if (result.success) return res.status(200).json({result});

        return res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' });
    } catch (err) {
        if (err?.message?.sqlState === '45000') {
            return res.status(400).json({ message: err?.message?.sqlMessage });
        }
        res.status(500).json({
            message: 'Error del servidor por favor intentelo mas tarde',
            error: err.message
        });
    }
});

// Get inventory for a specific product
Route.post('/by', validator, async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: "Falta el ID del producto" });
        }
        const productService = new Product(productId);
        const result = await productService.getProductInventory();
        res.status(200).json({result});
    } catch (err) {
        if (err?.message?.sqlState === '45000') {
            return res.status(400).json({ message: err?.message?.sqlMessage });
        }
        res.status(500).json({
            message: 'Error del servidor por favor intentelo mas tarde',
            error: err.message
        });
    }
});

module.exports = Route
