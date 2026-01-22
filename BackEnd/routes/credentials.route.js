// Librarys
const jwt = require('jsonwebtoken')
const { Router } = require('express')
const { compare } = require('bcrypt')
const { hash } = require('bcrypt')

// Imports
const Credentl = require('../services/Credentl.service')
const People = require('../services/People.service')
const { Fullinfo, ValidatorRol } = require('../middleware/validator.handler')
const { limiterLog, cookiesOptionsLog } = require('../middleware/varios.handler')

// Env vars
const secret = process.env.JWT_SECRET

// vars
const Route = Router()

// Middleware 
Route.use(Fullinfo(['cel_per','url_img','doc_per']))

// Routes
Route.put('/change-password', limiterLog, async (req,res) => {
    try {
        // Vars
        const saltRounds = 15
        const data = req.body
        const hashPwd = await hash(data.password, saltRounds)
        const cred = new Credentl({ ...data, hash_pass: await hashPwd })
        
        // Change password
        const changed = await cred.ChangePassword()
        if (changed?.success) return res.status(200).json(changed)

        res.status(500).json({ message: 'Error en el servidor intentelo más tarde' })
    } catch (err) {
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: err })
    }
})

Route.post('/register', async (req,res) => {
    // Vars 
    const user = new People()
    const saltRounds = 15
    const body = req.body
    
    try {   
        const create = await user.create({hash_pass: await hash(body.pas_per,saltRounds), ...body})
        res.status(201).json({result: { ...create }})
    } catch(err) {
        // console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if(err.status) return res.status(err.status).json({message: err.message})
        res.status(500).json({ message: err })
    }
})

Route.post('/login', limiterLog, async (req,res) => {
    // Vars
    const { firstData, secondData } = req.body
    const global = new Credentl(String(firstData))
    
    try {
        // Search in database
        let log = await global.login()
        let user = await log.result[0]

        // Verify
        const coincide = await compare(secondData, user.pas_per)

        if (!coincide) return res.status(401).json({ message: 'Contraseña invalida' })
        const token = jwt.sign(
            {   
                names: user.nom_per,
                lastNames: user.ape_per,
                roles: user.roles,
                doc: user.doc_per,
                email: user.email_per,
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
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })

        res.status(500).json({ message: err })
    }
})

Route.post('/login-google', limiterLog, async (req,res) => {
    try {
        // Vars
        const data = req.body
        const { requestState } = req.body
        const saltRounds = 15
        let user = null

        const loginWithGoogle = async () => {
            try {
                // Check recived data
                const globalLogin = new Credentl(String(data.email))
                let login = await globalLogin.login()
    
                if (!login?.result[0]?.pas_per) return res.status(202).json({ result: { login: false } })

                user = await login?.result[0]
            } catch (err) {
                if(err?.message?.sqlState === '45000') return res.status(202).json({ result: { login: false } })
            }
        }
        
        const registerWithGoogle = async () => {
            // Registrar con google
            const globalRegister = new Credentl({ hash_pass: await hash(data.passwd,saltRounds), ...data})
    
            // Search in database
            let regist = await globalRegister.googleLogin()
            user = await regist.result[0]
        }

        requestState === '2'? await registerWithGoogle(): await loginWithGoogle()

        if (!user) return

        const token = jwt.sign(
            {   
                names: user.nom_per,
                lastNames: user.ape_per,
                roles: user.roles,
                doc: user.doc_per,
                email: user.email_per,
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
                
        if (token) return res.status(200).json({
            result: {
                login: true,
                ...token
            } 
        })

    } catch (err) {
        console.log(err)
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })

        res.status(500).json({ message: err })
    }
})

Route.post('/JWT-encoder', limiterLog, async (req,res) => {
    try {
        // Vars
        let { content, lifeTime } = req.body
        const data = JSON.parse(content)
        lifeTime = `${lifeTime}h`

        const token = jwt.sign(
            data,
            secret,
            { expiresIn: lifeTime }
        )
                
        if (token) return res.status(200).json({ result: token })

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
        if(err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })

        res.status(500).json({ message: err })
    }
})

// Export 
module.exports = Route