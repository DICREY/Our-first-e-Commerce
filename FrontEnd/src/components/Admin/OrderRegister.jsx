// Librarys 
import React, { useState, useEffect } from 'react'
import {
    User, MapPin, CreditCard, Truck,
    Package, Plus, X, Save, ShoppingCart
} from 'lucide-react'

// Imports 
import AdminLoadingScreen from '../Global/Loading'
import { GetData, PostData } from '../../Utils/Requests'
import { errorStatusHandler, formatNumber, searchFilter, showAlert, showAlertLoading } from '../../Utils/utils'

// Import styles 
import styles from '../../styles/Admin/OrderRegister.module.css'

// Component 
export const OrderRegister = ({ URL = '' }) => {
    // Dynamic vars 
    const [customers, setCustomers] = useState([])
    const [customersAlmc, setCustomersAlmc] = useState([])
    const [products, setProducts] = useState([])
    const [productsAlmc, setProductsAlmc] = useState([])
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
            const got = await GetData(`${URL}/peoples/all`)
            setCustomers(got)
            setCustomersAlmc(got)
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }
    
    const GetShippingMethods = async () => {
        try {
            const got = await GetData(`${URL}/orders/shipping-methods`)
            setShippingMethods(got)
        } catch (err) {
            setIsLoading(false)
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }
    
    const GetPaymentMethods = async () => {
        try {
            const got = await GetData(`${URL}/orders/payment-methods`)
            setPaymentMethods(got)
        } catch (err) {
            setIsLoading(false)
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }
    
    const GetProducts = async () => {
        try {
            const got = await GetData(`${URL}/products/all`)
            setIsLoading(false)
            setProducts(got)
            setProductsAlmc(got)
        } catch (err) {
            setIsLoading(false)
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }
    
    // Fetch initial data
    useEffect(() => {
        GetCustomers()
        GetShippingMethods()
        GetPaymentMethods()
        GetProducts()
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

    const handleProductFilter = (term) => {
        const filterData = searchFilter(term, productsAlmc, ['nom_pro'])
        if (filterData) setProducts(filterData)
    }

    const handleCustomerFilter = (term) => {
        const filterData = searchFilter(term, customersAlmc, ['nom_per','doc_per','ape_per'])
        if (filterData) setCustomers(filterData)
    }

    const addProduct = () => {
        if (!currentProduct.product || !currentProduct.color || !currentProduct.size || currentProduct.quantity < 1) {
            setErrors({ products: 'Complete todos los campos del producto' })
            return
        }

        const selectedProduct = products.find(p => p.id_pro === currentProduct.product)
        const selectedColor = colors.find(c => c.nom_col === currentProduct.color)
        const selectedSize = sizes.find(s => s === currentProduct.size)

        setFormData(prev => ({
            ...prev,
            products: [
                ...prev.products,
                {
                    ...currentProduct,
                    productName: selectedProduct.nom_pro,
                    colorName: selectedColor.nom_col,
                    sizeName: selectedSize,
                    price: selectedProduct.pre_pro
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
        showAlertLoading('Registrando Pedido', 'Por favor, espere...', 'info')

        try {
            const newOrder = {
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
            }
            const response = await PostData(`${URL}/orders/register`, newOrder)

            if (response.success) {
                showAlert('Éxito', 'Pedido registrado correctamente', 'success')
            }
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {isLoading? (
                <AdminLoadingScreen message='Cargando Información' />
            ):(
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
                                        value={formData.keyName}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            setFormData(prev => ({
                                                ...prev,
                                                keyName: value
                                            }))
                                            handleCustomerFilter(value) 
                                        }}
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
                                                            keyName: `${customer.nom_per} ${customer.ape_per} (${customer.doc_per})`,
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
                                        {paymentMethods?.map((method,idx) => (
                                            <option key={idx + 78} value={method.nom_met_pag}>
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
                                        {shippingMethods?.map((method, idx) => (
                                            <option key={idx + 123} value={method.nom_met_env}>
                                                {method.nom_met_env} (${formatNumber(method.pre_met_env)})
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
                                            value={currentProduct?.name}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                setCurrentProduct({ ...currentProduct, name: value })
                                                handleProductFilter(value)
                                            }}
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
                                                            setCurrentProduct(prev => ({
                                                                ...prev,
                                                                product: product.id_pro,
                                                                name: `${product.nom_pro} ($${formatNumber(product.pre_pro)})`
                                                            }))
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
                                            {colors?.map((color, idx) => (
                                                <option key={idx} value={color.id}>
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
                                            {sizes?.map((size, idx) => (
                                                <option key={idx} value={size}>
                                                    {size}
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
                                                    <td>${formatNumber(product.price)}</td>
                                                    <td>${formatNumber(product.price * product.quantity)}</td>
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
                                                    ${formatNumber(formData.products.reduce((sum, product) => sum + (product.price * product.quantity), 0) || 0)}
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
                </main>
            )}
        </>
    )
}