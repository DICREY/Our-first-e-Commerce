// Librarys
const { Router } = require('express')

// Imports
const Inventory = require('../../services/Inventory.service')
const { authenticateJWT, ValidatorRol } = require('../../middleware/validator.handler')

// vars
const Route = Router()

// middleware Validator of credential 
const validator = [ authenticateJWT, ValidatorRol('Administrador') ]

// Routes

// Create single inventory entry
Route.post('/register', validator, async (req, res) => {
    try {
        const entries = req.body

        const inventory = new Inventory(entries)
        const result = await inventory.createEntry()

        if (result.success) return res.status(200).json({ result })
        return res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') {
            return res.status(500).json({ message: err?.message?.sqlMessage })
        }
        if (err.status) return res.status(err.status).json({ message: err.message })        
        res.status(500).json({ 
            message: 'Error del servidor por favor intentelo mas tarde', 
            error: err.message || err 
        })
    }
})

// Get all inventory entries
Route.get('/all', validator, async (req, res) => {
    try {
        const inventory = new Inventory()
        const result = await inventory.findAllEntries()

        if (result.success) return res.status(200).json({ result })

        return res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })
    } catch (err) {
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ 
            message: 'Error del servidor por favor intentelo mas tarde', 
            error: err.message || err 
        })
    }
})

// Get inventory entries by product
Route.post('/product', validator, async (req, res) => {
    try {
        const { id_pro } = req.body

        const inventory = new Inventory(id_pro)
        const result = await inventory.findByProduct()

        res.status(200).json(result)
    } catch (err) {
        if (err?.message?.sqlState === '45000') {
            return res.status(500).json({ message: err?.message?.sqlMessage })
        }
        if (err.status) {
            return res.status(err.status).json({ message: err.message })
        }
        res.status(500).json({ 
            message: 'Error del servidor por favor intentelo mas tarde', 
            error: err.message || err 
        })
    }
})

// Get inventory entries by date range
Route.post('/range', validator, async (req, res) => {
    try {
        const { startDate, endDate } = req.body

        if (!startDate || !endDate) {
            return res.status(400).json({ 
                message: "Fechas de inicio y fin requeridas" 
            })
        }

        const inventory = new Inventory(startDate, endDate)
        const result = await inventory.findByDateRange()

        if (!result.result || result.result.length === 0) {
            return res.status(404).json({ 
                message: "No hay entradas en el rango de fechas especificado", 
                result: [] 
            })
        }

        res.status(200).json(result)
    } catch (err) {
        if (err?.message?.sqlState === '45000') {
            return res.status(500).json({ message: err?.message?.sqlMessage })
        }
        if (err.status) {
            return res.status(err.status).json({ message: err.message })
        }
        res.status(500).json({ 
            message: 'Error del servidor por favor intentelo mas tarde', 
            error: err.message || err 
        })
    }
})

// Delete inventory entry
Route.delete('/delete', validator, async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).json({ message: "ID de entrada requerido" })
        }

        const inventory = new Inventory(id)
        const result = await inventory.delete()

        res.status(200).json(result)
    } catch (err) {
        if (err?.message?.sqlState === '45000') {
            return res.status(500).json({ message: err?.message?.sqlMessage })
        }
        if (err.status) {
            return res.status(err.status).json({ message: err.message })
        }
        res.status(500).json({ 
            message: 'Error del servidor por favor intentelo mas tarde', 
            error: err.message || err 
        })
    }
})

// Export 
module.exports = Route