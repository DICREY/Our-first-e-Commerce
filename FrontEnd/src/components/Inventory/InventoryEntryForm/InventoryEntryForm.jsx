// Libraries
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, X } from 'lucide-react'

// Imports
import { GetData, PostData } from '../../../Utils/Requests'
import { showAlert, errorStatusHandler } from '../../../Utils/utils'

// Styles
import styles from './InventoryEntryForm.module.css'

// Component
export const InventoryEntry = ({ URL = '', isOpen = false, onClose = () => { } }) => {
    // States
    const [isModalOpen, setIsModalOpen] = useState(isOpen)
    const [products, setProducts] = useState([])
    const [entries, setEntries] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [colors, setColors] = useState([])
    const [sizes, setSizes] = useState([])


    // Handle modal close
    const closeModal = () => {
        setIsModalOpen(false)
        onClose()
    }

    // Sync isOpen prop with state
    useEffect(() => {
        setIsModalOpen(isOpen)
    }, [isOpen])

    // React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            producto: '',
            cantidad: '',
            color: '',
            talla: '',
            costo: '',
            fecha_ingreso: new Date().toISOString().split('T')[0],
            hora_ingreso: new Date().toTimeString().slice(0, 5),
            notas: ''
        }
    })

    const watchProducto = watch('producto')

    // Load products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await GetData(`${URL}/products/all`)
                if (response) {
                    setProducts(response)
                }
            } catch (error) {
                const message = errorStatusHandler(error)
                showAlert('Error', message, 'error')
            }
        }

        fetchProducts()
    }, [])

    // Update colors and sizes when product changes
    useEffect(() => {
        if (watchProducto) {
            const product = products.find(p => p.id_pro === watchProducto)
            if (product) {
                setSelectedProduct(product)
                try {
                    const productColors = product.colors || []
                    setColors(productColors)
                } catch {
                    setColors([])
                }
                // Parse sizes from JSON
                try {
                    const productSizes = product.sizes || []
                    setSizes(productSizes)
                } catch {
                    setSizes([])
                }
            }
        }
    }, [watchProducto, products])

    // Handle add entry
    const onSubmit = async (data) => {
        try {
            const post = await PostData(`${URL}/inventory/entry/register`, data)
            if (post.success) {
                showAlert('Éxito', 'Entrada de inventario agregada correctamente', 'success')
            }
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        } finally {
            reset({
                producto: '',
                cantidad: '',
                color: '',
                talla: '',
                costo: '',
                fecha_ingreso: new Date().toISOString().split('T')[0],
                hora_ingreso: new Date().toTimeString().slice(0, 5),
                notas: ''
            })
            setSelectedProduct(null)
            closeModal()
        }
    }

    return (
        <>
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={`${styles.backBoton} backBoton`} onClick={closeModal} title="Cerrar formulario">
                            <X size={24} />
                        </button>
                        <div className={styles.container}>
                            <div className={styles.header}>
                                <h1>📦 Registro de Entrada de Inventario</h1>
                                <p>Registra nuevas entradas de productos al inventario</p>
                            </div>

                            <div className={styles.content}>
                                {/* Form Section */}
                                <div className={styles.formSection}>
                                    <h2>Agregar Nueva Entrada</h2>
                                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                                        {/* Date and Time Row */}
                                        <div className={styles.row}>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="fecha_ingreso">Fecha de Ingreso *</label>
                                                <input
                                                    type="date"
                                                    id="fecha_ingreso"
                                                    {...register('fecha_ingreso', {
                                                        required: 'La fecha es requerida'
                                                    })}
                                                    className={errors.fecha_ingreso ? styles.error : ''}
                                                />
                                                {errors.fecha_ingreso && (
                                                    <span className={styles.errorMessage}>{errors.fecha_ingreso.message}</span>
                                                )}
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label htmlFor="hora_ingreso">Hora de Ingreso *</label>
                                                <input
                                                    type="time"
                                                    id="hora_ingreso"
                                                    {...register('hora_ingreso', {
                                                        required: 'La hora es requerida'
                                                    })}
                                                    className={errors.hora_ingreso ? styles.error : ''}
                                                />
                                                {errors.hora_ingreso && (
                                                    <span className={styles.errorMessage}>{errors.hora_ingreso.message}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Selection */}
                                        <div className={styles.formGroup}>
                                            <label htmlFor="producto">Producto *</label>
                                            <select
                                                id="producto"
                                                {...register('producto', {
                                                    valueAsNumber: true,
                                                    required: 'Debes seleccionar un producto'
                                                })}
                                                className={errors.producto ? styles.error : ''}
                                            >
                                                <option value="">-- Selecciona un producto --</option>
                                                {products.map(product => (
                                                    <option key={product.id_pro} value={product.id_pro}>
                                                        {product.nom_pro} (${product.pre_pro})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.producto && (
                                                <span className={styles.errorMessage}>{errors.producto.message}</span>
                                            )}
                                        </div>

                                        {/* Color and Size Row */}
                                        {selectedProduct && (
                                            <div className={styles.row}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="color">Color *</label>
                                                    <select
                                                        id="color"
                                                        {...register('color', {
                                                            required: 'Debes seleccionar un color'
                                                        })}
                                                        className={errors.color ? styles.error : ''}
                                                    >
                                                        <option value="">-- Selecciona un color --</option>
                                                        {colors?.map((color, idx) => (
                                                            <option key={idx} value={color.nom_col}>
                                                                {color.nom_col}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.color && (
                                                        <span className={styles.errorMessage}>{errors.color.message}</span>
                                                    )}
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label htmlFor="talla">Talla *</label>
                                                    <select
                                                        id="talla"
                                                        {...register('talla', {
                                                            required: 'Debes seleccionar una talla'
                                                        })}
                                                        className={errors.talla ? styles.error : ''}
                                                    >
                                                        <option value="">-- Selecciona una talla --</option>
                                                        {sizes.map((size, idx) => (
                                                            <option key={idx} value={size}>
                                                                {size}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.talla && (
                                                        <span className={styles.errorMessage}>{errors.talla.message}</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Quantity and Cost Row */}
                                        <div className={styles.row}>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="cantidad">Cantidad de Ingreso *</label>
                                                <input
                                                    type="number"
                                                    id="cantidad"
                                                    placeholder="Cantidad de ingreso"
                                                    min="1"
                                                    step="1"
                                                    {...register('cantidad', {
                                                        required: 'La cantidad es requerida',
                                                        valueAsNumber: true,
                                                        min: {
                                                            value: 1,
                                                            message: 'La cantidad debe ser mayor a 0'
                                                        }
                                                    })}
                                                    className={errors.cantidad ? styles.error : ''}
                                                />
                                                {errors.cantidad && (
                                                    <span className={styles.errorMessage}>{errors.cantidad.message}</span>
                                                )}
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label htmlFor="costo">Costo por Ingreso *</label>
                                                <input
                                                    type="number"
                                                    id="costo"
                                                    placeholder="Costo por ingreso"
                                                    min="0.01"
                                                    step="0.01"
                                                    {...register('costo', {
                                                        required: 'El costo es requerido',
                                                        valueAsNumber: true,
                                                        min: {
                                                            value: 0.01,
                                                            message: 'El costo debe ser mayor a 0'
                                                        }
                                                    })}
                                                    className={errors.costo ? styles.error : ''}
                                                />
                                                {errors.costo && (
                                                    <span className={styles.errorMessage}>{errors.costo.message}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className={styles.formGroup}>
                                            <label htmlFor="notas">Notas (Opcional)</label>
                                            <textarea
                                                id="notas"
                                                placeholder="Notas adicionales sobre esta entrada..."
                                                rows="3"
                                                {...register('notas')}
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button type="submit" className='backButton'>
                                            <Plus size={20} />
                                            Agregar Entrada
                                        </button>
                                    </form>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default InventoryEntry

