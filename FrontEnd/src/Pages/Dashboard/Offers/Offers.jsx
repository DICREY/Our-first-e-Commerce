// Lbrarys 
import React, { useState, useEffect } from 'react'
import {
    Tag, X, Clock, Calendar,
    Percent, Save, Edit, Trash2
} from 'lucide-react'

// Imports 
import { capitalize, errorStatusHandler, formatDate, formatNumber, searchFilter, showAlert, showAlertLoading, showAlertSelect } from '../../../Utils/utils'
import { GetData, ModifyData, PostData } from '../../../Utils/Requests'

// Import styles 
import styles from './Offers.module.css'

// Component
export const OfferManager = ({ URL }) => {
    // Dynamic vars
    const [ offers, setOffers ] = useState([])
    const [ products, setProducts ] = useState([])
    const [ productsAlmc, setProductsAlmc ] = useState([])
    const [ categories, setCategories ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ isEditing, setIsEditing ] = useState(false)
    const [ currentOffer, setCurrentOffer ] = useState(null)
    const [ formData, setFormData ] = useState({
        id: '',
        name: '',
        description: '',
        duration: 24,
        discount: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        selectedProducts: [],
        selectedCategories: []
    })

    // Vars 
    let didFetch = false

    const fetchData = async () => {
        try {
            if (didFetch) return
            const [offersRes, productsRes, categoriesRes] = await Promise.all([
                GetData(`${URL}/offers/all`),
                GetData(`${URL}/products/all`),
                GetData(`${URL}/products/categories`)
            ])

            console.log(productsRes)
            setOffers(await offersRes)
            setProducts(await productsRes)
            setProductsAlmc(await productsRes)
            setCategories(await categoriesRes)
            setIsLoading(false)
            didFetch = true
        } catch (error) {
            const message = errorStatusHandler(error)
            showAlert('Error', message, 'error')
            setIsLoading(false)
        }
    }

    const filterProducts = (term) => {
        const filterData = searchFilter(term, productsAlmc, ['nom_pro'])
        if (filterData) setProducts(filterData)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'duration' || name === 'discount' ? parseInt(value) : value
        }))
    }

    const handleDateChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
            endDate: name === 'duration'
                ? new Date(Date.now() + value * 60 * 60 * 1000).toISOString().split('T')[0]
                : prev.endDate
        }))
    }

    const toggleProductSelection = (productId) => {
        setFormData(prev => {
            const newSelection = prev.selectedProducts.includes(productId)
                ? prev.selectedProducts.filter(id => id !== productId)
                : [...prev.selectedProducts, productId]
            return { ...prev, selectedProducts: newSelection }
        })
    }

    const toggleCategorySelection = (categoryId) => {
        setFormData(prev => {
            const newSelection = prev.selectedCategories.includes(categoryId)
                ? prev.selectedCategories.filter(id => id !== categoryId)
                : [...prev.selectedCategories, categoryId]
            return { ...prev, selectedCategories: newSelection }
        })
    }

    const handleEdit = (offer) => {
        setCurrentOffer(offer.id)
        setFormData({
            id: offer.id_ofe,
            name: offer.nom_ofe,
            description: offer.des_ofe,
            duration: offer.dur_ofe,
            discount: offer.por_des_ofe,
            startDate: offer.fec_ini_ofe.split('T')[0],
            endDate: offer.fec_fin_ofe.split('T')[0],
            selectedProducts: offer.products?.map(p => p.id) || [],
            selectedCategories: offer.categories?.map(c => c.id) || []
        })
        setIsEditing(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const offerData = {
            id_ofe: formData.id || 1,
            nom_ofe: formData.name,
            des_ofe: formData.description,
            dur_ofe: formData.duration,
            por_des_ofe: formData.discount,
            fec_ini_ofe: formData.startDate,
            fec_fin_ofe: formData.endDate,
            products: formData.selectedProducts,
            categories: formData.selectedCategories
        }

        try {
            didFetch = false
            showAlertLoading('Cargando...','Validando datos enviados','info')

            const url = isEditing? `${URL}/offers/modify`: `${URL}/offers/register`

            const method = isEditing ? await ModifyData(url, offerData):
            await PostData(url, offerData)

            if (method?.success) {
                fetchData()
                resetForm()
                showAlert('Exito',`${isEditing? 'Oferta modificada correctamente':'Oferta registrada correctamente'}`,'success')
            }
        } catch (error) {
            const message = errorStatusHandler(error)
            showAlert('Error', message, 'error')
        }
    }

    const handleDelete = async (id) => {
        const option = showAlertSelect('Desactivar oferta','¿Desea desactivar la oferta?','question')
        if ((await option).isConfirmed) {
            try {
                didFetch = false
                showAlertLoading('Cargando','Eliminando oferta...', 'info')
                const result = await ModifyData(`${URL}/offers/delete`, { by: id })
                if (result?.success) {
                    showAlert('Éxito', 'Oferta eliminada correctamente', 'success')
                    fetchData()
                }
            } catch (error) {
                const message = errorStatusHandler(error)
                showAlert('Error', message, 'error')
            }
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            duration: 24,
            discount: 10,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            selectedProducts: [],
            selectedCategories: []
        })
        setIsEditing(false)
        setCurrentOffer(null)
    }

    const changeState = async (id) => {
        const option = showAlertSelect('Cambiar estado','¿Desea cambiar el estado de la oferta?','question')
        if ((await option).isConfirmed) {
            try {
                showAlertLoading('Cargando...','Cambiando estado')
                const got = await ModifyData(`${URL}/offers/finish`, { by: id })
                if (got?.success) {
                    showAlert('Éxito', 'Estado cambiado correctamente', 'success')
                    fetchData()
                }
    
            } catch (err) {
                const message = errorStatusHandler(err)
                showAlert('Error', message, 'error')
            }
        }
    }

    // Fetch data
    useEffect(() => {
        fetchData()
    }, [URL])

    if (isLoading) {
        return <div className={styles.loading}>Cargando...</div>
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>
                    <Tag size={20} /> Gestión de Ofertas
                </h2>
                <p className={styles.subtitle}>Crea y administra ofertas especiales</p>
            </header>

            <main className={styles.content}>
                {/* Formulario de ofertas */}
                <form onSubmit={handleSubmit} className={styles.offerForm}>
                    <h3 className={styles.sectionTitle}>
                        {isEditing ? 'Editar Oferta' : 'Crear Nueva Oferta'}
                    </h3>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Nombre de la Oferta*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder='Nombre de la oferta'
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Descripción*</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder='Descripción de la oferta'
                                required
                                className={styles.textarea}
                                rows="3"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label><Percent size={16} /> Descuento (%)*</label>
                            <input
                                type="number"
                                name="discount"
                                min="1"
                                max="100"
                                value={formData.discount}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label><Clock size={16} /> Duración (horas)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleDateChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label><Calendar size={16} /> Fecha Inicio*</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleDateChange}
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label><Calendar size={16} /> Fecha Fin*</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleDateChange}
                                required
                                className={styles.input}
                            />
                        </div>
                    </div>

                    {/* Selección de productos */}
                    <div className={styles.selectionSection}>
                        <span className={styles.subHeader}>
                            <h4 className={styles.subsectionTitle}>Productos en Oferta</h4>
                            <input 
                                type="text" 
                                placeholder='Buscar producto por nombre'
                                className={`${styles.input} expand`}
                                onChange={(e) => filterProducts(e.target.value)}
                            />
                        </span>
                        <div className={styles.itemsGrid}>
                            {products?.map(product => (
                                <div
                                    key={product.id_pro}
                                    className={`${styles.itemCard} ${formData.selectedProducts.includes(product.id_pro) ? styles.selected : ''}`}
                                    onClick={() => toggleProductSelection(product.id_pro)}
                                >
                                    <div className={styles.itemCheckbox}>
                                        {formData.selectedProducts.includes(product.id_pro) && (
                                            <div className={styles.checkmark}>✓</div>
                                        )}
                                    </div>
                                    <div className={styles.itemName}>{product.nom_pro}</div>
                                    <div className={styles.itemPrice}>${formatNumber(product.pre_pro)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selección de categorías */}
                    <div className={styles.selectionSection}>
                        <h4 className={styles.subsectionTitle}>Categorías en Oferta</h4>
                        <div className={styles.itemsGrid}>
                            {categories?.map((category, idx) => (
                                <div
                                    key={category.id_cat_pro}
                                    className={`${styles.itemCard} ${formData.selectedCategories.includes(category.id_cat_pro) ? styles.selected : ''}`}
                                    onClick={() => toggleCategorySelection(category.id_cat_pro)}
                                >
                                    <div className={styles.itemCheckbox}>
                                        {formData.selectedCategories.includes(category.id_cat_pro) && (
                                            <div className={styles.checkmark}>✓</div>
                                        )}
                                    </div>
                                    <div className={styles.itemName}>{category.nom_cat_pro}</div>
                                    {category.des_cat_pro > 0 && (
                                        <div className={styles.itemDiscount}>-{category.des_cat_pro}%</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={resetForm}
                            className={styles.cancelButton}
                        >
                            <X size={16} /> Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                        >
                            {isEditing ? (
                                <>
                                    <Edit size={16} /> Actualizar Oferta
                                </>
                            ) : (
                                <>
                                    <Save size={16} /> Crear Oferta
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Lista de ofertas existentes */}
                <div className={styles.offersList}>
                    <h3 className={styles.sectionTitle}>Ofertas Activas</h3>

                    {offers?.length === 0 ? (
                        <div className={styles.emptyState}>
                            No hay ofertas registradas
                        </div>
                    ) : (
                        <div className={styles.offersGrid}>
                            {offers?.map((offer, idx) => (
                                <div key={idx} className={styles.offerCard}>
                                    <div className={styles.offerHeader}>
                                        <h4 className={styles.offerTitle}>{offer.nom_ofe}</h4>
                                        <div 
                                            className={`${styles.offerStatus} ${offer.sta_ofe === 'ACTIVA' ? styles.active : offer.sta_ofe === 'PENDIENTE' ? styles.pending : styles.ended}`}
                                            onClick={() => {
                                                if (offer.sta_ofe === 'FINALIZADA'){
                                                    return showAlert('Oferta finalizada', 'No se puede cambiar el estado de una oferta finalizada', 'error')
                                                }
                                                changeState(offer.id_ofe)
                                            }}
                                        >
                                            {capitalize(offer.sta_ofe)}
                                        </div>
                                    </div>

                                    <div className={styles.offerMeta}>
                                        <div className={styles.offerDiscount}>
                                            {offer.por_des_ofe}% de descuento
                                        </div>
                                        <div className={styles.offerDates}>
                                            <Calendar size={14} /> {formatDate(offer.fec_ini_ofe)} - {formatDate(offer.fec_fin_ofe)}
                                        </div>
                                        <div className={styles.offerDates}>
                                        </div>
                                    </div>

                                    <div className={styles.offerDescription}>
                                        {offer.des_ofe}
                                    </div>

                                    <div className={styles.offerStats}>
                                        <div className={styles.statItem}>
                                            <span className={styles.statLabel}>Productos:</span>
                                            <span className={styles.statValue}>{offer.Products?.length || 0}</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span className={styles.statLabel}>Categorías:</span>
                                            <span className={styles.statValue}>{offer.Categories?.length || 0}</span>
                                        </div>
                                    </div>

                                    <div className={styles.offerActions}>
                                        <button
                                            onClick={() => handleEdit(offer)}
                                            className={styles.editButton}
                                        >
                                            <Edit size={14} /> Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(offer.id_ofe)}
                                            className={styles.deleteButton}
                                        >
                                            <Trash2 size={14} /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}