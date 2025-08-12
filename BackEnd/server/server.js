// Librarys 
const express = require('express')

// Imports 
const credentl = require('../routes/credentials.route')
const cookies = require('../routes/cookies.route')
const stats = require('../routes/stats.route')
const peoples = require('../routes/people.route')
const products = require('../routes/product.route')
const orders = require('../routes/order.route')
const offer = require('../routes/offer.route')
const testing = require('../routes/test.route')

// function to Define routers
function routerApi(app) {
    // Router
    const router = express.Router()

    // Main router
    app.use('/ecommerce',router)

    // Secundary Routes
    router.use('/credential',credentl)
    router.use('/cookies',cookies)
    router.use('/stats',stats)
    router.use('/peoples',peoples)
    router.use('/products',products)
    router.use('/orders',orders)
    router.use('/offers',offer)
    router.use('/test',testing)
}

// Export Router
module.exports = { routerApi }