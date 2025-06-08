 // Librarys
// const jwt = require('jsonwebtoken')
// const { compare } = require('bcrypt')
const { Router } = require('express')
// const { hash } = require('bcrypt')

// Imports
const Test = require('../services/test.service')
// const { limiterLog, cookiesOptions, cookiesOptionsLog } = require('../middleware/varios.handler')
// const { authenticateJWT } = require('../middleware/validator.handler')

// Env vars
const secret = process.env.JWT_SECRET

// vars
const Route = Router()

Route.get('/test', async (req, res) => {
    const test = new Test()
    try {
        const testing = await test.test()
        if (testing.found) return res.status(200).json(testing)
    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: err })
    }
})

module.exports = Route