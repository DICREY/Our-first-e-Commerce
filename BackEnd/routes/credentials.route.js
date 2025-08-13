// Librarys
const jwt = require('jsonwebtoken')
const { Router } = require('express')
const { compare } = require('bcrypt')
const { hash } = require('bcrypt')

// Imports
const Credentl = require('../services/Credentl.service')
const People = require('../services/People.service')
const { Fullinfo } = require('../middleware/validator.handler')
const { limiterLog, cookiesOptionsLog } = require('../middleware/varios.handler')

// Env vars
const secret = process.env.JWT_SECRET

// vars
const Route = Router()

// Middleware 
Route.use(Fullinfo(['empty']))

// Routes
Route.post('/register', async (req,res) => {
    // Vars 
    const user = new People()
    const saltRounds = 15
    const body = req.body
    
    try {
        // Verifiy if exist
        const find = await user.findBy(toString(body.doc_per))
        if (find.result[0][0].nom_per) res.status(302).json({ message: "Usuario ya existe" })
            
        const create = await user.create({hash_pass: await hash(body.pas_per,saltRounds), ...body})
        res.status(201).json(create)
    } catch(err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

Route.post('/login', limiterLog, async (req,res) => {
    // Vars
    const { firstData, secondData } = req.body
    const global = new Credentl(firstData)
    
    try {
        // Search in database
        let log = await global.login()
        let user = await log.result[0]

        // Verify
        const coincide = await compare(secondData, user.pas_per)

        if (!coincide) return res.status(401).json({ message: 'Credenciales inválidas' })
        const token = jwt.sign(
            {   
                names: user.nom_per,
                lastNames: user.ape_per,
                roles: user.roles,
                doc: user.doc_per,
                img: user.fot_per,
                theme: user.theme
            },
            secret,
            { expiresIn: '8h' }
        )

        res.cookie('__cred', token, cookiesOptionsLog)
        res.cookie('__nit', secret, cookiesOptionsLog)

        if (user.roles) res.cookie('__user', user.roles, cookiesOptionsLog)
        if (user.nom_per && user.ape_per) res.cookie('__userName', `${user.nom_per} ${user.ape_per}`, cookiesOptionsLog)

        res.status(200).json({ __cred: token })

    } catch (err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })

        res.status(500).json({ message: err })
    }
})

Route.post('/preffers/change-theme', limiterLog, async (req,res) => {
    // Vars
    const { doc, theme } = req.body
    const global = new Credentl(doc, theme)

    try {
        // Search in database
        let log = await global.ChangeTheme()
        if (!log.success) return res.status(500).json({ message: 'Error al cambiar el tema' })

        res.status(200).json({ result: log })

    } catch (err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })

        res.status(500).json({ message: err })
    }
})

// Export 
module.exports = Route