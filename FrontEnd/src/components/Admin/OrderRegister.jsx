// Librarys 
import React, { useState, useEffect } from 'react'
import {
    User, MapPin, CreditCard, Truck,
    Package, Plus, X, Save, ShoppingCart
} from 'lucide-react'

// Imports 
import AdminLoadingScreen from '../Global/Loading'
import { GetData } from '../../Utils/Requests'
import { errorStatusHandler, formatNumber } from '../../Utils/utils'

// Import styles 
import styles from '../../styles/Admin/OrderRegister.module.css'

// Component 
export const OrderRegister = ({ URL, onOrderCreated }) => {
    // Dynamic vars 
    const [customers, setCustomers] = useState([])
    const [products, setProducts] = useState([])
    const [paymentMethods, setPaymentMethods] = useState([])
    const [shippingMethods, setShippingMethods] = useState([])
    const [colors, setColors] = useState([])
    const [sizes, setSizes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showDropDown, setShowDropDown] = useState(null)
    const [showDropDownProduct, setShowDropDownProduct] = useState(null)
    const [currentClient, setCurrentClient] = useState()
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        customerDocument: '',
        shippingAddress: '',
        paymentMethod: '',
        shippingMethod: '',
        products: []
    })

    const [currentProduct, setCurrentProduct] = useState({
        product: '',
        color: '',
        size: '',
        quantity: 1
    })

    const GetCustomers = async () => {
        try {
            const response = await GetData(`${URL}/peoples/all`)
            setCustomers(response)
        } catch (err) {
            const message = errorStatusHandler(err)
            console.error('Error fetching customers:', message)
        }
    }

    const GetProducts = async () => {
        try {
            const response = await GetData(`${URL}/products/all`)
            setProducts(response)
        } catch (err) {
            const message = errorStatusHandler(err)
            console.error('Error fetching customers:', message)
        }
    }


    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [custRes, prodRes, payRes, shipRes] = await Promise.all([
                    fetch(`${URL}/payment-methods`),
                    fetch(`${URL}/shipping-methods`)
                ])

                setCustomers(await custRes.json())
                setProducts(await prodRes.json())
                setPaymentMethods(await payRes.json())
                setShippingMethods(await shipRes.json())
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error)
                setIsLoading(false)
            }
        }

        GetCustomers()
        GetProducts()
        fetchData()
    }, [URL])

    // Fetch colors and sizes when product changes
    useEffect(() => {
        if (currentProduct.product) {
            const selectedProduct = products.find(p => p.id === currentProduct.product)
            if (selectedProduct) {
                setColors(selectedProduct.colors || [])
                setSizes(selectedProduct.sizes || [])
            }
        }
    }, [currentProduct.product, products])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleProductChange = (e) => {
        const { name, value } = e.target
        setCurrentProduct(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const addProduct = () => {
        if (!currentProduct.product || !currentProduct.color || !currentProduct.size || currentProduct.quantity < 1) {
            setErrors({ products: 'Complete todos los campos del producto' })
            return
        }

        const selectedProduct = products.find(p => p.id === currentProduct.product)
        const selectedColor = colors.find(c => c.id === currentProduct.color)
        const selectedSize = sizes.find(s => s.id === currentProduct.size)

        setFormData(prev => ({
            ...prev,
            products: [
                ...prev.products,
                {
                    ...currentProduct,
                    productName: selectedProduct.name,
                    colorName: selectedColor.name,
                    sizeName: selectedSize.name,
                    price: selectedProduct.price
                }
            ]
        }))

        setCurrentProduct({
            product: '',
            color: '',
            size: '',
            quantity: 1
        })
        setErrors(prev => ({ ...prev, products: null }))
    }

    const removeProduct = (index) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index)
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.customerDocument) newErrors.customerDocument = 'Cliente requerido'
        if (!formData.shippingAddress) newErrors.shippingAddress = 'Dirección requerida'
        if (!formData.paymentMethod) newErrors.paymentMethod = 'Método de pago requerido'
        if (!formData.shippingMethod) newErrors.shippingMethod = 'Método de envío requerido'
        if (formData.products.length === 0) newErrors.products = 'Agregue al menos un producto'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsSubmitting(true)
        setIsLoading(true)
        
        try {
            const response = await fetch(`${URL}/orders/register`, {
                documento_cliente: formData.customerDocument,
                direccion_envio: formData.shippingAddress,
                metodo_pago_nombre: formData.paymentMethod,
                metodo_envio_nombre: formData.shippingMethod,
                productos_json: formData.products.map(p => ({
                    producto: p.productName,
                    color: p.colorName,
                    talla: p.sizeName,
                    cantidad: p.quantity
                }))
            })

            if (response.success) {
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            setErrors({ general: error.message })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>
                    <ShoppingCart size={20} /> Nuevo Pedido
                </h2>
                <p className={styles.subtitle}>Complete los detalles del pedido</p>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
                {errors.general && (
                    <div className={styles.formError}>
                        {errors.general}
                    </div>
                )}

                <div className={styles.formGrid}>
                    {/* Customer and Shipping Info */}
                    <div className={styles.formColumn}>
                        <div className={`${styles.formGroup} ${errors.customerDocument ? styles.hasError : ''}`}>
                            <label><User size={16} /> Cliente*</label>
                            <input
                                name="customerDocument"
                                value={formData.customerDocument}
                                onChange={handleChange}
                                placeholder='Nombre'
                                className={styles.select}
                                onFocus={() => setShowDropDown(1)}
                            />
                            {showDropDown && (
                                <div className="dropdown">
                                    {customers?.map((customer, index) => (
                                        <div
                                            key={index + 9082}
                                            className="dropdown-item"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    customerDocument: customer.doc_per,
                                                    shippingAddress: customer.dir_per
                                                }))
                                                setShowDropDown(false)
                                            }}
                                        >
                                            <div className="dropdown-contenido">
                                                <div className="dropdown-nombre">{customer.nom_per} {customer.ape_per} ({customer.doc_per})</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.customerDocument && <span className={styles.errorText}>{errors.customerDocument}</span>}
                        </div>

                        <div className={`${styles.formGroup} ${errors.shippingAddress ? styles.hasError : ''}`}>
                            <label><MapPin size={16} /> Dirección de Envío*</label>
                            <input
                                type="text"
                                name="shippingAddress"
                                value={formData.shippingAddress}
                                onChange={handleChange}
                                placeholder="Ingrese la dirección completa"
                                className={styles.input}
                            />
                            {errors.shippingAddress && <span className={styles.errorText}>{errors.shippingAddress}</span>}
                        </div>
                    </div>

                    {/* Payment and Shipping Methods */}
                    <div className={styles.formColumn}>
                        <div className={`${styles.formGroup} ${errors.paymentMethod ? styles.hasError : ''}`}>
                            <label><CreditCard size={16} /> Método de Pago*</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="">Seleccionar método de pago</option>
                                {paymentMethods.map(method => (
                                    <option key={method.id} value={method.nom_met_pag}>
                                        {method.nom_met_pag}
                                    </option>
                                ))}
                            </select>
                            {errors.paymentMethod && <span className={styles.errorText}>{errors.paymentMethod}</span>}
                        </div>

                        <div className={`${styles.formGroup} ${errors.shippingMethod ? styles.hasError : ''}`}>
                            <label><Truck size={16} /> Método de Envío*</label>
                            <select
                                name="shippingMethod"
                                value={formData.shippingMethod}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="">Seleccionar método de envío</option>
                                {shippingMethods.map(method => (
                                    <option key={method.id} value={method.nom_met_env}>
                                        {method.nom_met_env}
                                    </option>
                                ))}
                            </select>
                            {errors.shippingMethod && <span className={styles.errorText}>{errors.shippingMethod}</span>}
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className={styles.productsSection}>
                    <h3 className={styles.sectionTitle}>
                        <Package size={16} /> Productos del Pedido
                    </h3>

                    {errors.products && (
                        <div className={styles.errorText}>{errors.products}</div>
                    )}

                    {/* Add Product Form */}
                    <div className={styles.addProductForm}>
                        <div className={styles.productGrid}>
                            <div className={styles.formGroup}>
                                <label>Producto*</label>
                                <input
                                    name="product"
                                    value={currentProduct.product}
                                    onChange={handleProductChange}
                                    className={styles.select}
                                    placeholder='Buscar producto...'
                                    onFocus={() => setShowDropDownProduct(1)}
                                >
                                </input>
                                {showDropDownProduct && (
                                    <div className="dropdown">
                                        {products?.map((product, index) => (
                                            <div
                                                key={index + 9082}
                                                className="dropdown-item"
                                                onClick={() => {
                                                    // setFormData(prev => ({
                                                    //     ...prev,
                                                    //     product: [...prev.product],
                                                    // }))
                                                    setCurrentProduct(product.id)
                                                    setColors(product.colors)
                                                    setSizes(product.sizes)
                                                    setShowDropDownProduct(false)
                                                }}
                                            >
                                                <div className="dropdown-contenido">
                                                    <div className="dropdown-nombre">{product.nom_pro} (${formatNumber(product.pre_pro)})</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Color*</label>
                                <select
                                    name="color"
                                    value={currentProduct.color}
                                    onChange={handleProductChange}
                                    className={styles.select}
                                    disabled={!currentProduct.product}
                                >
                                    <option value="">Seleccionar color</option>
                                    {colors?.map(color => (
                                        <option key={color.id} value={color.id}>
                                            {color.nom_col}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Talla*</label>
                                <select
                                    name="size"
                                    value={currentProduct.size}
                                    onChange={handleProductChange}
                                    className={styles.select}
                                    disabled={!currentProduct.product}
                                >
                                    <option value="">Seleccionar talla</option>
                                    {sizes.map(size => (
                                        <option key={size.id} value={size.id}>
                                            {size.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Cantidad*</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={currentProduct.quantity}
                                    onChange={handleProductChange}
                                    min="1"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={addProduct}
                            className={styles.addButton}
                        >
                            <Plus size={16} /> Agregar Producto
                        </button>
                    </div>

                    {/* Products List */}
                    <div className={styles.productsList}>
                        {formData.products.length === 0 ? (
                            <div className={styles.emptyList}>No hay productos agregados</div>
                        ) : (
                            <table className={styles.productsTable}>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Color</th>
                                        <th>Talla</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>Subtotal</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.products.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product.productName}</td>
                                            <td>{product.colorName}</td>
                                            <td>{product.sizeName}</td>
                                            <td>{product.quantity}</td>
                                            <td>${product.price.toFixed(2)}</td>
                                            <td>${(product.price * product.quantity).toFixed(2)}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => removeProduct(index)}
                                                    className={styles.removeButton}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="5" className={styles.totalLabel}>Total:</td>
                                        <td className={styles.totalAmount}>
                                            ${formData.products.reduce((sum, product) => sum + (product.price * product.quantity), 0).toFixed(2)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        )}
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                    >
                        <X size={16} /> Cancelar
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            'Registrando...'
                        ) : (
                            <>
                                <Save size={16} /> Registrar Pedido
                            </>
                        )}
                    </button>
                </div>
            </form>
            {isLoading && (
                <AdminLoadingScreen message='Cargando Información' />
            )}
        </main>
    )
}