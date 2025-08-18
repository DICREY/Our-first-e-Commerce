// Librarys
const { Router } = require('express')
const { hash } = require('bcrypt')

// Imports
const Offer = require('../services/Offer.service')
const { authenticateJWT, ValidatorRol, Fullinfo } = require('../middleware/validator.handler')

// vars
const Route = Router()
const offerInst = new Offer()

// Routes
Route.get('/all', async ( req, res ) => {
    try {
        const search = await offerInst.findAll()
        if (!search.result) return res.status(404).json({ message: "Ofertas no encontradas" })

        res.status(200).json(search)
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.get('/product', async ( req, res ) => {
    try {
        const search = await offerInst.offerProduct()
        
        if (!search.result) return res.status(404).json({ message: "Ofertas no encontradas" })

        res.status(200).json(search)
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

// Middleware 
Route.use(Fullinfo(['products', 'categories', 'dur_ofe']))

Route.post('/by', async (req,res) => {
    try {
        // Vars 
        const by = String(req.body.by)
        const ord = new Offer(by)
        const find = await ord.findBy()

        if (find) return res.status(200).json(find)

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })
    } catch(err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.use(authenticateJWT)
Route.use(ValidatorRol("administrador"))

Route.post('/register', async (req,res) => {
    try {
        // Vars 
        const body = req.body
        const prod = new Offer(body)
        const create = await prod.create()

        if (!create.success) return res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })

        res.status(201).json({ result: create })
    } catch(err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})
Route.put('/modify', ValidatorRol("administrador"),async (req,res) => {
    try {
        // Vars 
        const { body } = req
        const offer = new Offer(body)

        const modified = await offer.modify()
        if (modified.success) return res.status(200).json(modified)
    } catch (err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.put('/finish', ValidatorRol("administrador"),async (req,res) => {
    try {
        // Vars 
        const by = String(req.body.by)
        const ord = new Offer(by)

        const mod = await ord.ChangeState()
        if (mod.success) return res.status(200).json(mod)

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })
    } catch (err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.put('/delete', ValidatorRol("administrador"),async (req,res) => {
    try {
        // Vars 
        const by = String(req.body.by)
        const offer = new Offer(by)

        const offerDeleted = await offer.delete(by)
        if (offerDeleted.success) return res.status(200).json(offerDeleted)

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })
    } catch (err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.post('/test', async (req,res) => {
    try {
        // Vars 
        const body = req.body
        const prod = new Product(body)
        const create = await prod.test()

        if (create.success) return res.status(201).json(create)

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })
    } catch(err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

// Export 
module.exports = Route