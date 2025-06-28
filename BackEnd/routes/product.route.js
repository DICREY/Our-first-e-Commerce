// Librarys
const { Router } = require('express')
const { hash } = require('bcrypt')

// Imports
const Product = require('../services/Product.service')
const { authenticateJWT, ValidatorRol, Fullinfo } = require('../middleware/validator.handler')

// vars
const Route = Router()
const prodInst = new Product()
// Middleware 
Route.use(authenticateJWT)
Route.use(ValidatorRol("usuario"))

// Routes
Route.get('/all', async (req,res) => {
    try {
        const search = await prodInst.findAll()
        if (!search.result) return res.status(404).json({ message: "Productos no encontrados"})

        res.status(200).json(search)
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.get('/categories', async (req,res) => {
    try {
        // Vars 
        const productInstans = new Product()

        // Verifiy if exists
        const search = await productInstans.findAllCategories()
        if (!search.result) res.status(404).json({ message: "Productos no encontrados"})

        res.status(200).json(search)
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

// Call Middleware for verify the request data
Route.use(Fullinfo(['empty']))

Route.post('/all/by', async (req,res) => {
    // Vars 
    const by = req.body?.by
    
    try {
        if (!by) return res.status(400).json({ message: "Petición invalida, faltan datos"})
            
        // Verifiy if exists
        const search = await prodInst.findAllBy(by)
        if (!search.result) res.status(404).json({ message: "Productos no encontrados"})

        res.status(200).json(search)
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.post('/by', async (req,res) => {
    // Vars 
    const { by } = req.body
    
    try {
        if (!by) return res.status(400).json({ message: "Petición invalida, faltan datos"})

        // Verifiy if exist
        const search = await prodInst.findBy(by)
        if (!search.result) res.status(404).json({ message: "Producto no encontrado" })

        res.status(200).json(search)
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.post('/by/categorie', async (req,res) => {
    // Vars 
    const { by } = req.body
    
    try {
        const product = new Product(by)
        if (!by) return res.status(400).json({ message: "Petición invalida, faltan datos"})

        // Verifiy if exist
        const search = await product.findByCategory()
        if (!search.result) res.status(404).json({ message: "Producto no encontrado" })

        res.status(200).json(search)
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.post('/register', async (req,res) => {
    // Vars 
    const saltRounds = 15
    const body = req.body
    
    try {
        // Verifiy if exist
        const find = await prodInst.findBy(toString(body.doc_per))
        if (find.result[0][0].nom_per) res.status(302).json({ message: "Producto ya existe" })

        const create = await prodInst.create({ hash_pass: await hash(body.pas_per,saltRounds), ...body })
        res.status(201).json(create)

    } catch(err) {
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})
Route.put('/modify', async (req,res) => {
    // Vars 
    const { body } = req
    const saltRounds = 15
        
    try {
        // Verifiy if exist
        const find = await prodInst.findBy(body.doc_per)
        if (!find.result) res.status(404).json({ message: "Producto no encontrado" })

        const passwd = body.pas_per.length < 50? await hash(body.pas_per,saltRounds): String(body.pas_per)

        const modified = await passwd?
            await prodInst.modify({ hash_pass: passwd,...body })
            :res.status(400).json({ message: "Petición no valida"})

        if (modified.modified) return res.status(200).json(modified)
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({ message: err.message })

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})
Route.delete('/delete', async (req,res) => {
    // Vars 
    const { body } = req
    console.log(body)
        
    try {
        // Verifiy if exist
        const find = await prodInst.findBy(toString(body.doc_per))
        if (!find.result) res.status(404).json({ message: "Producto no encontrado" })

        const peopleDeleted = await prodInst.delete(body.doc_per)
        if (peopleDeleted.deleted) return res.status(200).json(peopleDeleted)

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

// Export 
module.exports = Route