// Librarys 
import React, { useEffect, useState } from 'react'
import {
    Package, Tag, List, Palette,
    Ruler, DollarSign, Type, AlignLeft,
    X, Save, Plus, Trash2,
    ImageIcon
} from 'lucide-react'

// Imports 
import { errorStatusHandler } from '../../Utils/utils'
import { GetData, PostData } from '../../Utils/Requests'
import AdminLoadingScreen from '../Global/Loading'

// Import styles 
import styles from '../../styles/Products/ProductRegister.module.css'

// Component 
export const ProductRegister = ({ URL = '', imgDefault = '' }) => {
    const [currentColor, setCurrentColor] = useState({ name: '', hex: '' })
    const [currentSize, setCurrentSize] = useState('')
    const [currentImage, setCurrentImage] = useState('')
    const [categories, setCategories] = useState(null)
    const [sizes, setSizes] = useState(null)
    const [showDropDown, setShowDropDown] = useState(null)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState()
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        onSale: false,
        category: '',
        colors: [],
        sizes: [],
        images: []
    })


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }))
        }
    }

    const addColor = () => {
        if (!currentColor.name || !currentColor.hex) return

        setFormData(prev => ({
            ...prev,
            colors: [...prev.colors, currentColor]
        }))
        setCurrentColor({ name: '', hex: '' })
    }

    const addSize = () => {
        if (!currentSize) return

        setFormData(prev => ({
            ...prev,
            sizes: [...prev.sizes, currentSize]
        }))
        setCurrentSize('')
    }

    const addImage = () => {
        if (!currentImage) return

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, currentImage]
        }))
        setCurrentImage('')
    }

    const removeItem = (type, index) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name) newErrors.name = 'Nombre requerido'
        if (!formData.price || isNaN(formData.price)) newErrors.price = 'Precio inválido'
        if (!formData.category) newErrors.category = 'Categoría requerida'
        if (formData.colors.length === 0) newErrors.colors = 'Al menos un color requerido'
        if (formData.sizes.length === 0) newErrors.sizes = 'Al menos una talla requerida'
        if (formData.images.length === 0) newErrors.images = 'Al menos una imagen requerida'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        setIsLoading(true)
        try {
            const response = await PostData(`${URL}/products/register`, formData)
            console.log(response)
            if (response.success) {
                setIsSubmitting(false)
                setIsLoading(false)
            }
        } catch (err) {
            setIsLoading(false)
            const message = errorStatusHandler(err)
            console.log(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const GetCat = async () => {
        try {
            const got = await GetData(`${URL}/products/categories`)
            setCategories(got)
            console.log(got)
        } catch (err) {
            const message = errorStatusHandler(err)
            console.log(message)
        }
    }

    const GetSizes = async () => {
        try {
            const got = await GetData(`${URL}/products/sizes`)
            setSizes(got)
            setIsLoading(false)
            console.log(got)
        } catch (err) {
            setIsLoading(false)
            const message = errorStatusHandler(err)
            console.log(message)
        }
    }

    if (isLoading) {
        return (
            <AdminLoadingScreen message='Cargando...' />
        )
    }

    useEffect(() => {
        GetCat()
        GetSizes()
    }, [])

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>
                    <Package size={20} /> Nuevo Producto
                </h2>
                <p className={styles.subtitle}>Complete los detalles del producto</p>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
                {errors.general && (
                    <div className={styles.formError}>
                        {errors.general}
                    </div>
                )}

                <div className={styles.formGrid}>
                    {/* Columna izquierda - Información básica */}
                    <div className={styles.formColumn}>
                        <div className={`${styles.formGroup} ${errors.name ? styles.hasError : ''}`}>
                            <label><Type size={16} /> Nombre del Producto*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej: Camiseta básica"
                                className={styles.input}
                            />
                            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                <Tag size={16} /> En oferta
                                <input
                                    type="checkbox"
                                    name="onSale"
                                    checked={formData.onSale}
                                    onChange={handleChange}
                                    className={styles.toggleSwitch}
                                />
                            </label>
                        </div>

                        <div className={styles.formGroup}>
                            <label><AlignLeft size={16} /> Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Detalles del producto..."
                                rows="4"
                                className={styles.textarea}
                            />
                        </div>
                    </div>

                    {/* Columna derecha - Variantes y multimedia */}
                    <div className={styles.formColumn}>
                        <div className={`${styles.formGroup} ${errors.price ? styles.hasError : ''}`}>
                            <label><DollarSign size={16} /> Precio*</label>
                            <div className={styles.inputWithSymbol}>
                                <span>$</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className={styles.input}
                                />
                            </div>
                            {errors.price && <span className={styles.errorText}>{errors.price}</span>}
                        </div>

                        <div className={`${styles.formGroup} ${errors.category ? styles.hasError : ''}`}>
                            <label><List size={16} /> Categoría*</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories?.map((cat, idx) => (
                                    <option key={idx + 989} value={cat.nom_cat_pro}>{cat.nom_cat_pro}</option>
                                ))}
                            </select>
                            {errors.category && <span className={styles.errorText}>{errors.category}</span>}
                        </div>

                        {/* Sección de tallas */}
                        <div className={`${styles.formGroup} ${errors.sizes ? styles.hasError : ''}`}>
                            <label><Palette size={16} /> Tallas*</label>
                            <div className={styles.multiInputGroup}>
                                <input
                                    type="text"
                                    value={currentSize}
                                    onChange={(e) => {
                                        setCurrentSize(e.target.value)
                                    }}
                                    placeholder="Ingrese una talla"
                                    className={styles.input}
                                    onFocus={() => setShowDropDown(1)}
                                />
                                {showDropDown && (
                                    <div className="dropdown">
                                        {sizes?.map((size, index) => (
                                            <div
                                                key={index + 9082}
                                                className="dropdown-item"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        sizes: [...prev.sizes, size.nom_tal_pro]
                                                    }))
                                                    setCurrentSize(size.nom_tal_pro)
                                                    setShowDropDown(false)
                                                }}
                                            >
                                                <div className="dropdown-contenido">
                                                    <div className="dropdown-nombre">{size.nom_tal_pro}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={addSize}
                                    className={styles.addButton}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className={styles.tagsContainer}>
                                {formData.sizes?.map((size, index) => (
                                    <div key={index} className={styles.sizeTag}>
                                        {size}
                                        <button
                                            type="button"
                                            onClick={() => removeItem('sizes', index)}
                                            className={styles.tagRemove}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {errors.sizes && <span className={styles.errorText}>{errors.sizes}</span>}
                        </div>
                    </div>
                    {/* Sección Integrada de Colores e Imágenes */}
                    <section className={styles.integratedSection}>
                        <div className={`${styles.formGroup} ${errors.colors ? styles.hasError : ''}`}>
                            <label><Palette size={16} /> Colores e Imágenes*</label>

                            {/* Lista de colores con sus imágenes */}
                            {formData.colors?.map((color, colorIndex) => (
                                <div key={colorIndex} className={styles.colorImageGroup}>
                                    <div className={styles.colorHeader}>
                                        <span
                                            className={styles.colorBadge}
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <span className={styles.colorName}>{color.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeItem('colors', colorIndex)}
                                            className={styles.tagRemove}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    {/* Input para agregar imágenes a este color específico */}
                                    <div className={styles.imageInputGroup}>
                                        <input
                                            type="text"
                                            value={color.images ? color.images[color.images.length - 1]?.url || '' : ''}
                                            onChange={(e) => {
                                                const newColors = [...formData.colors];
                                                if (!newColors[colorIndex].images) newColors[colorIndex].images = [];
                                                newColors[colorIndex].images.push({ url: e.target.value });
                                                setFormData({ ...formData, colors: newColors });
                                            }}
                                            placeholder="URL de imagen para este color"
                                            className={styles.input}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newColors = [...formData.colors];
                                                if (newColors[colorIndex].images && newColors[colorIndex].images.length > 0) {
                                                    const lastImage = newColors[colorIndex].images[newColors[colorIndex].images.length - 1].url;
                                                    if (lastImage) {
                                                        newColors[colorIndex].images.push({ url: '' });
                                                    }
                                                } else {
                                                    newColors[colorIndex].images = [{ url: '' }];
                                                }
                                                setFormData({ ...formData, colors: newColors });
                                            }}
                                            className={styles.addButton}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    {/* Previsualización de imágenes para este color */}
                                    <div className={styles.colorImagesPreview}>
                                        {color.images?.map((img, imgIndex) => (
                                            img.url && (
                                                <div key={imgIndex} className={styles.imagePreviewItem}>
                                                    <img
                                                        src={img.url}
                                                        alt={`${color.name} ${imgIndex}`}
                                                        onError={(e) => e.target.src = imgDefault || 'https://via.placeholder.com/80'}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newColors = [...formData.colors];
                                                            newColors[colorIndex].images.splice(imgIndex, 1);
                                                            setFormData({ ...formData, colors: newColors });
                                                        }}
                                                        className={styles.imageRemove}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Input para agregar nuevo color */}
                            <div className={styles.newColorGroup}>
                                <div className={styles.multiInputGroup}>
                                    <input
                                        type="text"
                                        value={currentColor.name}
                                        onChange={(e) => setCurrentColor({ ...currentColor, name: e.target.value })}
                                        placeholder="Nombre del color"
                                        className={styles.input}
                                    />
                                    <div className={styles.colorPickerWrapper}>
                                        <input
                                            type="color"
                                            value={currentColor.hex}
                                            onChange={(e) => setCurrentColor({ ...currentColor, hex: e.target.value })}
                                        />
                                        <span>{currentColor.hex}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (currentColor.name && currentColor.hex) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    colors: [...prev.colors, {
                                                        ...currentColor,
                                                        images: []
                                                    }]
                                                }));
                                                setCurrentColor({ name: '', hex: '#ffffff' });
                                            }
                                        }}
                                        className={styles.addButton}
                                    >
                                        <Plus size={16} /> Color
                                    </button>
                                </div>
                            </div>
                            {errors.colors && <span className={styles.errorText}>{errors.colors}</span>}
                        </div>
                    </section>    
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
                            'Guardando...'
                        ) : (
                            <>
                                <Save size={16} /> Guardar Producto
                            </>
                        )}
                    </button>
                </div>
            </form>
        </main>
    )
}