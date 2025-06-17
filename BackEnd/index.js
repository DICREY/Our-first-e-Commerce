// librarys
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
require('dotenv').config()

// Imports 
// const { errorHandler } = require('./middleware/error.handler')
// const { validatorHeaders } = require('./middleware/validator.handler')
const { corsOptions, limiter } = require('./middleware/varios.handler')
const { routerApi } = require('./server/server')

// vars
const app = express()
const port = process.env.PORT
const secret = process.env.JWT_SECRET

// desativar header extra 
app.disable('x-powered-by')

// middlewares
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.json())
app.use(cors(corsOptions))
// app.use(errorHandler)
// app.use(validatorHeaders)
app.use(limiter)
app.use(cookieParser(secret))

// Routes
routerApi(app)

// Listen 
app.listen(port,'0.0.0.0',() => console.log(`Back-End is on: http://localhost:${port}/ecommerce`))