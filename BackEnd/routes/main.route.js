// Librarys
const jwt = require('jsonwebtoken')
const { compare } = require('bcrypt')
const { Router } = require('express')

// Imports
const Main = require('../services/Main.service')
const { limiterLog, cookiesOptionsLog } = require('../middleware/varios.handler')
const { Fullinfo } = require('../middleware/validator.handler')

// Env vars
const secret = process.env.JWT_SECRET

// Vars 
const Route = Router()

// Middleware 
Route.use(Fullinfo(['empty']))

// Routes
Route.post('/login', limiterLog, async (req,res) => {
    // Vars
    const { firstData, secondData } = req.body
    const main = new Main(firstData)
    
    try {
        // Search in database
        let log = await main.login()
        let user = await log.result[0][0]

        if(!user) return res.status(404).json({ message: 'Usuario no encontrado' })
        // Verify
        const coincide = await compare(secondData, user.pas_per)

        if (!coincide) return res.status(401).json({ message: 'Credenciales inválidas' })
        const cred = jwt.sign(
            {   
                names: user.nom_per,
                lastNames: user.ape_per,
                roles: user.roles,
                doc: user.doc_per,
                img: user.fot_per
            },
            secret,
            { expiresIn: '8h' }
        )

        res.cookie('__cred', cred, cookiesOptionsLog)
        res.cookie('__nit', secret, cookiesOptionsLog)

        if (user.roles) res.cookie('__user', user.roles, cookiesOptionsLog)
        if (user.nom_per && user.ape_per) res.cookie('__userName', `${user.nom_per} ${user.ape_per}`, cookiesOptionsLog)

        res.status(200).json({ __cred: cred })
    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message })

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

// Export 
module.exports = Route