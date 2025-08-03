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
Route.get('/general', async (req,res) => {
    try {
        const stat = new Stats()
        const search = await stat.StatsGeneral()
        if (!search.result) return res.status(404).json({ message: "Información no encontrada"})

        res.status(200).json(search)
    } catch (err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

Route.get('/sellest', async (req,res) => {
    try {
        const stat = new Stats()
        const search = await stat.SellestProducts()
        if (!search.result) return res.status(404).json({ message: "Información no encontrada"})

        res.status(200).json({...search})
    } catch (err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

Route.get('/weekly-sales', async (req,res) => {
    try {
        const stat = new Stats()
        const search = await stat.WeeklySales()
        if (!search.result) return res.status(404).json({ message: "Información no encontrada"})

        res.status(200).json({...search})
    } catch (err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

Route.get('/monthly-sales', async (req,res) => {
    try {
        const stat = new Stats()
        const search = await stat.MonthlySales()
        if (!search.result) return res.status(404).json({ message: "Información no encontrada"})

        res.status(200).json({...search})
    } catch (err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

Route.get('/sales-per-day', async (req,res) => {
    try {
        const stat = new Stats()
        const search = await stat.SalesPerDay()
        if (!search.result) return res.status(404).json({ message: "Información no encontrada"})

        res.status(200).json({...search})
    } catch (err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

Route.get('/today-sales', async (req,res) => {
    try {
        const stat = new Stats()
        const search = await stat.TodaySales()
        if (!search.result) return res.status(404).json({ message: "Información no encontrada"})

        res.status(200).json({...search})
    } catch (err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

Route.get('/sales-summary', async (req,res) => {
    try {
        const stat = new Stats()
        const search = await stat.SalesSummary()

        res.status(200).json({...search})
    } catch (err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

// Export 
module.exports = Route