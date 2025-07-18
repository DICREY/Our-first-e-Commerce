// Librarys
const { Router } = require('express')
const { hash } = require('bcrypt')

// Imports
const Order = require('../services/Order.service')
const { authenticateJWT, ValidatorRol, Fullinfo } = require('../middleware/validator.handler')

// vars
const Route = Router()
const orderInst = new Order()

// Routes
Route.get('/all', async (req,res) => {
    try {
        const search = await orderInst.findAll()
        if (!search.result) return res.status(404).json({ message: "Pedidos no encontrados"})

        res.status(200).json(search)
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

// Middleware 
// Route.use(authenticateJWT)
// Route.use(ValidatorRol("usuario"))
// , ValidatorRol("administrador")
Route.post('/register', async (req,res) => {
    try {
        // Vars 
        const body = req.body
        const prod = new Product(body)
        const create = await prod.create()

        if (create.success) return res.status(201).json(create)

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })
    } catch(err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})
Route.put('/modify', ValidatorRol("administrador"),async (req,res) => {
    // Vars 
    const { body } = req
    const saltRounds = 15
        
    try {
        // Verifiy if exist
        const find = await orderInst.findBy(body.doc_per)
        if (!find.result) res.status(404).json({ message: "Pedido no encontrado" })

        const passwd = body.pas_per.length < 50? await hash(body.pas_per,saltRounds): String(body.pas_per)

        const modified = await passwd?
            await orderInst.modify({ hash_pass: passwd,...body })
            :res.status(400).json({ message: "Petición no valida"})

        if (modified.modified) return res.status(200).json(modified)
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({ message: err.message })

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})
Route.delete('/delete', ValidatorRol("administrador"),async (req,res) => {
    // Vars 
    const { body } = req
    console.log(body)
        
    try {
        // Verifiy if exist
        const find = await orderInst.findBy(toString(body.doc_per))
        if (!find.result) res.status(404).json({ message: "Pedido no encontrado" })

        const peopleDeleted = await orderInst.delete(body.doc_per)
        if (peopleDeleted.deleted) return res.status(200).json(peopleDeleted)

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })
    } catch (err) {

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