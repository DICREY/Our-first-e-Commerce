// Librarys 
const { Router } = require('express')

// Imports 
// const { authenticateJWT } = require('../middleware/validator.handler')
const Stats = require('../services/Stats.service')

// Vars 
const Route = Router()

// Middleware 
// Route.use(authenticateJWT)

// Routes
Route.get('/sellest', async (req,res) => {
    try {
        const stat = new Stats()
        const search = await stat.SellestProducts()
        if (!search.result) return res.status(404).json({ message: "Información no encontrada"})

        res.status(200).json({...search})
    } catch (err) {
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

// Export 
module.exports = Route