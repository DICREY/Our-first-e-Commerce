// Librarys 
const express = require('express')

// Imports 
const testing = require('../routes/test.route')

// function to Define routers
function routerApi(app) {
    // Router
    const router = express.Router()

    // Main router
    app.use('/',router)

    // Secundary Routes
    router.use('/test',testing)
}

// Export Router
module.exports = { routerApi }