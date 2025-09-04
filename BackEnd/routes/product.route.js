// Librarys
const { Router } = require('express')
const { hash } = require('bcrypt')

// Imports
const Product = require('../services/Product.service')
const { authenticateJWT, ValidatorRol, Fullinfo } = require('../middleware/validator.handler')

// vars
const Route = Router()
const prodInst = new Product()

// Routes
Route.get('/all', async (req, res) => {
    try {
        const search = await prodInst.findAll()
        if (!search.result) return res.status(404).json({ message: "Productos no encontrados" })

        res.status(200).json(search)
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.get('/categories', async (req, res) => {
    try {
        // Vars 
        const productInstans = new Product()

        // Verifiy if exists
        const search = await productInstans.findAllCategories()
        if (!search.result) res.status(404).json({ message: "Productos no encontrados" })

        res.status(200).json(search)
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.get('/colors', async (req, res) => {
    try {
        // Vars 
        const productInstans = new Product()

        // Verifiy if exists
        const search = await productInstans.findAllColors()
        if (!search.result) res.status(404).json({ message: "Colores no encontrados" })

        res.status(200).json(search)
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.get('/sizes', async (req, res) => {
    try {
        // Vars 
        const productInstans = new Product()

        // Verifiy if exists
        const search = await productInstans.findAllSizes()
        if (!search.result) res.status(404).json({ message: "Tamaños no encontrados" })

        res.status(200).json(search)
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.get('/brands', async (req, res) => {
    try {
        // Vars 
        const productInstans = new Product()

        // Verifiy if exists
        const search = await productInstans.findAllBrands()

        res.status(200).json(search)
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

const cartFavoriteMiddleware = [authenticateJWT, ValidatorRol("usuario")];

// ============ CARRITO ============

Route.post('/cart/add', cartFavoriteMiddleware, async (req, res) => {
    try {
        const { doc_per, id_inv, quantity } = req.body;
        const userDoc = doc_per;
        const productService = new Product({ userDoc, id_inv, quantity });

        const result = await productService.addToCart();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        if (err?.message?.sqlState === '45000') {
            return res.status(400).json({ message: err?.message?.sqlMessage });
        }
        res.status(500).json({
            message: 'Error del servidor por favor intentelo mas tarde',
            error: err.message
        });
    }
});

Route.put('/cart/update', cartFavoriteMiddleware, async (req, res) => {
    try {
        const body = req.body;
        const userDoc = req.body.doc_per;
        const productService = new Product({ userDoc, ...body });

        const result = await productService.updateCartItem();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        if (err?.message?.sqlState === '45000') {
            return res.status(400).json({ message: err?.message?.sqlMessage });
        }
        res.status(500).json({
            message: 'Error del servidor por favor intentelo mas tarde',
            error: err.message
        });
    }
});

Route.post('/cart/remove', cartFavoriteMiddleware, async (req, res) => {
    try {
        const body = req.body;
        const userDoc = req.body.doc_per;
        const productService = new Product({ userDoc, ...body });

        const result = await productService.removeFromCart();
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        if (err?.message?.sqlState === '45000') {
            return res.status(400).json({ message: err?.message?.sqlMessage });
        }
        res.status(500).json({
            message: 'Error del servidor por favor intentelo mas tarde',
            error: err.message
        });
    }
});


// Carrito - obtener por POST
Route.post('/cart/by', cartFavoriteMiddleware, async (req, res) => {
    try {
        const { email } = req.body
        const productService = new Product(email)

        const result = await productService.getUserCart()
        res.status(200).json(result)
    } catch (err) {
        console.log(err);
        if (err?.message?.sqlState === '45000') {
            return res.status(400).json({ message: err?.message?.sqlMessage });
        }
        res.status(500).json({
            message: 'Error del servidor por favor intentelo mas tarde',
            error: err.message
        });
    }
});

// ============ FAVORITOS ============

Route.post('/favorites/add', cartFavoriteMiddleware, async (req, res) => {
    try {
        const body = req.body;
        const productService = new Product({...body})

        const result = await productService.addToFavorites()
        res.status(200).json({ result: result })
    } catch (err) {
        console.error(err);
        if (err?.message?.sqlState === '45000') {
            return res.status(400).json({ message: err?.message?.sqlMessage });
        }
        res.status(500).json({
            message: 'Error del servidor por favor intentelo mas tarde',
            error: err.message
        });
    }
});

Route.post('/favorites/remove', cartFavoriteMiddleware, async (req, res) => {
    try {
        const body = req.body;
        const productService = new Product({...body})

        const result = await productService.removeFromFavorites();
        res.status(200).json({ result: result })
    } catch (err) {
        console.error(err);
        if (err?.message?.sqlState === '45000') {
            return res.status(400).json({ message: err?.message?.sqlMessage });
        }
        res.status(500).json({
            message: 'Error del servidor por favor intentelo mas tarde',
            error: err.message
        });
    }
});

// Favoritos - obtener por POST
Route.post('/favorites/by', cartFavoriteMiddleware, async (req, res) => {
    try {
        const { email } = req.body;
        if (email !== req.body.email) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        const productService = new Product(email);
        const result = await productService.getUserFavorites();
        res.status(200).json(result)
    } catch (err) {
        console.error(err);
        if (err?.message?.sqlState === '45000') {
            return res.status(400).json({ message: err?.message?.sqlMessage });
        }
        res.status(500).json({
            message: 'Error del servidor por favor intentelo mas tarde',
            error: err.message
        });
    }
});

Route.post('/inventory', async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: "Falta el ID del producto" });
        }
        const productService = new Product(productId);
        const result = await productService.getProductInventory();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        if (err?.message?.sqlState === '45000') {
            return res.status(400).json({ message: err?.message?.sqlMessage });
        }
        res.status(500).json({
            message: 'Error del servidor por favor intentelo mas tarde',
            error: err.message
        });
    }
});

// Call Middleware for verify the request data
Route.use(Fullinfo(['img_default', 'colors', 'sizes', 'inv']))

Route.post('/all/by', async (req, res) => {
    // Vars 
    const by = req.body?.by

    try {
        if (!by) return res.status(400).json({ message: "Petición invalida, faltan datos" })

        // Verifiy if exists
        const search = await prodInst.findAllBy(by)
        if (!search.result) res.status(404).json({ message: "Productos no encontrados" })

        res.status(200).json(search)
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.post('/by', async (req, res) => {
    try {
        // Vars 
        const by = String(req.body.by)
        const inst = new Product(by)

        if (!by) return res.status(400).json({ message: "Petición invalida, faltan datos" })

        // Verifiy if exist
        const search = await inst.findBy()
        if (!search.result) res.status(404).json({ message: "Producto no encontrado" })

        res.status(200).json(search)
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.post('/by/categorie', async (req, res) => {
    // Vars 
    const { by } = req.body

    try {
        const product = new Product(by)
        if (!by) return res.status(400).json({ message: "Petición invalida, faltan datos" })

        // Verifiy if exist
        const search = await product.findByCategory()
        if (!search.result) res.status(404).json({ message: "Producto no encontrado" })

        res.status(200).json(search)
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

// Middleware 
Route.use(authenticateJWT)
Route.use(ValidatorRol("administrador"))

Route.post('/register', async (req, res) => {
    try {
        // Vars 
        const body = req.body
        const prod = new Product(body)
        const create = await prod.create()

        if (create.success) return res.status(201).json({ result: create })

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.put('/modify', ValidatorRol("administrador"), async (req, res) => {
    try {
        // Vars 
        const { body } = req
        const proMod = new Product(body)

        const mod = await proMod.modify()
        if (mod.success) return res.status(200).json(mod)
        
        res.status(500).json({ message: "Error en la petición" })
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.put('/change-status', ValidatorRol("administrador"), async (req, res) => {
    try {
        // Vars 
        const by = String(req.body.by)
        const prod = new Product(by)

        const modified = await prod.ChangeStatus()

        if (modified.success) return res.status(200).json(modified)
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.delete('/delete', ValidatorRol("administrador"), async (req, res) => {    
    try {
        // Vars 
        const { body } = req
        console.log(body)

        const peopleDeleted = await prodInst.delete(body.doc_per)
        if (peopleDeleted.deleted) return res.status(200).json(peopleDeleted)

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })
    } catch (err) {

        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})

Route.post('/test', async (req, res) => {
    try {
        // Vars 
        const body = req.body
        const prod = new Product(body)
        const create = await prod.test()

        if (create.success) return res.status(201).json(create)

        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde' })
    } catch (err) {
        console.log(err)
        if (err?.message?.sqlState === '45000') return res.status(500).json({ message: err?.message?.sqlMessage })
        if (err.status) return res.status(err.status).json({ message: err.message })
        res.status(500).json({ message: 'Error del servidor por favor intentelo mas tarde', error: err })
    }
})



// Export 
module.exports = Route