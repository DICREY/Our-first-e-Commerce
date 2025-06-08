// Librarys 
const express = require('express')

// Imports 
const credentl = require('../routes/credentials.route')
const cookies = require('../routes/cookies.route')
const peoples = require('../routes/people.route')
const testing = require('../routes/test.route')

// function to Define routers
function routerApi(app) {
    // Router
    const router = express.Router()

    // Main router
    app.use('/',router)

    // Secundary Routes
    router.use('/credential',credentl)
    router.use('/cookie',cookies)
    router.use('/people',peoples)
    router.use('/test',testing)
}

// Export Router
module.exports = { routerApi }