// Librarys
const { Router } = require('express')
const { hash } = require('bcrypt')

// Imports
const People = require('../services/People.service')
const { authenticateJWT, ValidatorRol, Fullinfo } = require('../middleware/validator.handler')

// vars
const people = new People()
const Route = Router()

// Middleware 
// Route.use(authenticateJWT)
// Route.use(ValidatorRol("administrador"))

// Routes
Route.get('/all', async (req,res) => {
    try {
        const search = await people.findAll()
        if (!search.result) return res.status(404).json({ message: "Usuarios no encontrado"})

        res.status(200).json(search)
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.get('/all:by', async (req,res) => {
    // Vars 
    const by = req.params.by
    
    try {
        if (!by) return res.status(400).json({ message: "Petición invalida, faltan datos"})
            
        // Verifiy if exists
        const search = await people.findAllBy(by)

        res.status(200).json(search)
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

// Call Middleware for verify the request data
Route.use(Fullinfo(['nom2_per', 'ape2_per', 'doc_per', 'cel2_per', 'fot_per', 'cel_per', 'dir_per']))

Route.put('/change-rol', ValidatorRol('administrador'), async (req,res) => {
    // Vars
    const data = req.body
    const modRol = new People(data)

    try {
        // Search in database
        let log = await modRol.ChangeRoles()
        if (!log.success) return res.status(500).json({ message: 'Error al editar roles' })

        res.status(200).json(log)
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })

        res.status(500).json({ message: err })
    }
})

Route.put('/change-email', ValidatorRol('usuario'), async (req,res) => {
    // Vars
    const data = req.body
    const modEmail = new People(data)

    try {
        // Search in database
        const log = await modEmail.ChangeEmail()
        if (!log.success) return res.status(500).json({ message: 'Error al editar email' })

        res.status(200).json(log)
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })

        res.status(500).json({ message: err })
    }
})

Route.post('/by', async (req,res) => {
    try {
        // Vars 
        const by = req.body.by
        const inst = new People(by)
        const search = await inst.findBy(by)

        res.status(200).json(search)
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.post('/register', async (req,res) => {
    try {
        // Vars 
        const saltRounds = 15
        const body = req.body

        const create = await people.create({ hash_pass: await hash(body.pas_per,saltRounds), ...body })

        res.status(201).json(create)
    } catch(err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.put('/modify', async (req,res) => {
    try {
        // Vars 
        const { body } = req

        const modified = await people.modify(body)
        
        if (modified.success) return res.status(200).json(modified)
            
        res.status(400).json({ message: "Petición no valida"})
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({ message: err.message })

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})
Route.put('/delete', async (req,res) => {
    try {
        // Vars 
        const by = String(req.body.by)
        const pep = new People(by)

        const del = await pep.delete()
        if (del.success) return res.status(200).json(del)

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

// Export 
module.exports = Route