// Librarys
const jwt = require('jsonwebtoken')

// Env vars
const secret = process.env.JWT_SECRET

// Handle Validations middlewares
function validatorHeaders (req,res,next) {
    // Headers
    const apiKey = req.signedCookies? req.signedCookies.__nit: req.headers['x-api-key']
    const contentType = req.headers['accept']
    const userAgent = req.headers['user-agent']
    const user = req.signedCookies? req.signedCookies.__userName: 'Unknow User'

    // Validation
    if (!apiKey || apiKey !== secret ) {
        return res.status(498).json({ error: 'Usuario no autorizado' })
    }
    if (!contentType ) {
        return res.status(400).json({ error: 'Contenido invalido' })
    }
    if (!userAgent || !user ) {
        return res.status(401).json({ error: 'Usuario invalido' })
    }

    // Next to
    next()
}

// Middleware de validación
function authenticateJWT(req, res, next) {
    const token = req.signedCookies?.__cred
    
    if (!token) return res.status(403).json({ error: 'Token no proporcionado' })
  
    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token inválido o expirado' })
        
        req.user = decoded // Almacena datos del usuario en la request
        next()
    })
}

function ValidatorRol(requireRol = '') {
    return (req,res,next) => {
        const rolesHeader = req.signedCookies?.__user
        // Verificación más robusta del header
        if (!rolesHeader || typeof rolesHeader !== 'string') {
            return res.status(403).json({ message: 'Roles perdidos o invalidos' })
        }
      
        const roles = rolesHeader.split(',').map(role => role.trim())
        
        // Comparación case-insensitive
        const isAdmin = roles.some(role => role.toLowerCase() === requireRol.toLowerCase())
        
        // Manejo de acceso
        if (!isAdmin) return res.status(401).json({ message: 'No tienes permisos para esta acción' })
    
        next()
    }
}

// export middleware 
module.exports = { validatorHeaders, ValidatorRol, authenticateJWT}