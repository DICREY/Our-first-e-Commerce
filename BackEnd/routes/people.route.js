// Librarys
const { Router } = require('express')
const { hash } = require('bcrypt')

// Imports
const People = require('../services/People.service')
const { authenticateJWT, ValidatorRol } = require('../middleware/validator.handler')

// vars
const people = new People()
const Route = Router()

// Middleware 
// Route.use(authenticateJWT)

// Routes
Route.get('/all', ValidatorRol("administrador"), async (req,res) => {
    try {
        const search = await people.findAll()
        if (!search.result) return res.status(404).json({ message: "Usuarios no encontrado"})

        res.status(200).json(search)
    } catch (err) {
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

Route.get('/all:by', ValidatorRol("administrador"), async (req,res) => {
    // Vars 
    const by = req.params.by
    
    try {
        // Verifiy if exists
        const search = await people.findAllBy(by)
        if (!search.result) res.status(404).json({ message: "Usuarios no encontrados"})

        res.status(200).json(search)
    } catch (err) {
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

Route.get('/by:by', ValidatorRol("administrador"), async (req,res) => {
    // Vars 
    const by = req.params.by
    
    try {
        // Verifiy if exist
        const search = await people.findBy(by)
        if (!search.result) res.status(404).json({ message: "Usuario no encontrado" })

        res.status(200).json(search)
    } catch (err) {
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})
Route.post('/register', async (req,res) => {
    // Vars 
    const saltRounds = 15
    const body = req.body
    
    try {
        // Verifiy if exist
        const find = await people.findBy(toString(body.doc))
        if (find.result[0][0].nom_per) res.status(302).json({ message: "Usuario ya existe" })

        const create = await people.create({hash_pass: await hash(body.passwd,saltRounds), ...body})
        res.status(201).json(create)

    } catch(err) {
        console.log(err)
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

Route.put('/modify', ValidatorRol("administrador"), async (req,res) => {
    // Vars 
    const { body } = req
    const saltRounds = 15
        
    try {
        // Verifiy if exist
        const find = await people.findBy(toString(body.doc))
        if (!find.result) res.status(404).json({ message: "Usuario no encontrado" })

        const modified = await people.modify({hash_pass: await hash(body.passwd,saltRounds), ...body})
        if(modified.modified) return res.status(200).json(modified)
    } catch (err) {
        if(err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: err })
    }
})
Route.delete('/delete', ValidatorRol("administrador"), async (req,res) => {
    // Vars 
    const { body } = req
        
    try {
        // Verifiy if exist
        const find = await people.findBy(toString(body.doc))
        if (!find.result) res.status(404).json({ message: "Usuario no encontrado" })

        const peopleDeleted = await people.delete(body.doc)
        if (peopleDeleted.deleted) return res.status(200).json(peopleDeleted)

        res.status(500).json({ message: "Error interno" })
    } catch (err) {
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

// Export 
module.exports = Route