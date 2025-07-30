// Librarys 
import React, { useEffect, useState } from 'react'
import {
    Package, Tag, List, Palette,
    DollarSign, Type, AlignLeft,
    X, Save, Plus, Trash2,
} from 'lucide-react'

// Imports 
import { CheckImage, errorStatusHandler, showAlert, showAlertLoading } from '../../Utils/utils'
import { GetData, PostData } from '../../Utils/Requests'
import AdminLoadingScreen from '../Global/Loading'

// Import styles 
import styles from '../../styles/Products/ProductRegister.module.css'
import { useNavigate } from 'react-router-dom'

// Component 
export const ProductRegister = ({ URL = '', imgDefault = '' }) => {
    const [currentColor, setCurrentColor] = useState({ name: '', hex: '#000000' })
    const [currentSize, setCurrentSize] = useState('')
    const [currentImageColor, setCurrentImageColor] = useState('')
    const [categories, setCategories] = useState(null)
    const [sizes, setSizes] = useState(null)
    const [showDropDown, setShowDropDown] = useState(null)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState()
    const [formData, setFormData] = useState({
        nom_pro: '',
        pre_pro: '',
        des_pro: '',
        onSale: false,
        nom_cat: '',
        colores: [],
        tallas: [],
    })

    // Vars
    const navigate = useNavigate()

    // Functions
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

    const addSize = () => {
        if (!currentSize) return

        setFormData(prev => ({
            ...prev,
            tallas: [...prev.tallas, currentSize]
        }))
        setCurrentSize('')
    }

    const removeItem = (type, index) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.nom_pro) newErrors.nom_pro = 'Nombre requerido'
        if (!formData.pre_pro || isNaN(formData.pre_pro) || formData.pre_pro.length > 10 ) newErrors.pre_pro = 'Precio inválido maximo 10 numeros'
        if (!formData.nom_cat) newErrors.category = 'Categoría requerida'
        if (formData.colores.length === 0) newErrors.colores = 'Al menos un color requerido'
        if (formData.tallas.length === 0) newErrors.tallas = 'Al menos una talla requerida'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        showAlertLoading('Cargando...', 'Por favor espera', 'info')

        try {
            console.log(formData)
            formData.hex_colores = String(formData.colores.map(i => i.hex))
            formData.imgs = String(formData.colores.map(i => i.url))
            formData.colores = String(formData.colores.map(i => i.name))
            formData.tallas = String(formData.tallas)
            const response = await PostData(`${URL}/products/register`, formData)
            console.log(response)
            if (response.success) {
                setIsSubmitting(false)
                setIsLoading(false)
                showAlert('Éxito', 'Producto registrado exitosamente', 'success')
                setTimeout(() => {
                    navigate('/admin/products')
                }, 3000)
            }
        } catch (err) {
            setIsSubmitting(false)
            setIsLoading(false)
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }

    const GetCat = async () => {
        try {
            const got = await GetData(`${URL}/products/categories`)
            setCategories(got)
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }

    const GetSizes = async () => {
        try {
            const got = await GetData(`${URL}/products/sizes`)
            setSizes(got)
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }

    const addColorAndImage = (colorIdx) => {
        const newColors = [...formData.colores]
        const replic = newColors?.some(i => i?.url?.includes(currentImageColor))

        if (replic) return
        newColors[colorIdx].url = currentImageColor
        setFormData({ ...formData, colores: newColors })
    }   

    // if (isLoading) {
    //     return (
    //         <AdminLoadingScreen message='Cargando...' />
    //     )
    // }

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
                        <div className={`${styles.formGroup} ${errors.nom_pro ? styles.hasError : ''}`}>
                            <label><Type size={16} /> Nombre del Producto*</label>
                            <input
                                type="text"
                                name="nom_pro"
                                value={formData.nom_pro}
                                onChange={handleChange}
                                placeholder="Ej: Camiseta básica"
                                className={styles.input}
                            />
                            {errors.nom_pro && <span className={styles.errorText}>{errors.nom_pro}</span>}
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
                                name="des_pro"
                                value={formData.des_pro}
                                onChange={handleChange}
                                placeholder="Detalles del producto..."
                                rows="4"
                                className={styles.textarea}
                            />
                        </div>
                    </div>

                    {/* Columna derecha - Variantes y multimedia */}
                    <div className={styles.formColumn}>
                        <div className={`${styles.formGroup} ${errors.pre_pro ? styles.hasError : ''}`}>
                            <label><DollarSign size={16} /> Precio*</label>
                            <div className={styles.inputWithSymbol}>
                                <span>$</span>
                                <input
                                    type="number"
                                    name="pre_pro"
                                    value={formData.pre_pro}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    maxLength={10}
                                    className={styles.input}
                                />
                            </div>
                            {errors.pre_pro && <span className={styles.errorText}>{errors.pre_pro}</span>}
                        </div>

                        <div className={`${styles.formGroup} ${errors.nom_cat ? styles.hasError : ''}`}>
                            <label><List size={16} /> Categoría*</label>
                            <select
                                name="nom_cat"
                                value={formData.nom_cat}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories?.map((cat, idx) => (
                                    <option key={idx + 989} value={cat.nom_cat_pro}>{cat.nom_cat_pro}</option>
                                ))}
                            </select>
                            {errors.nom_cat && <span className={styles.errorText}>{errors.nom_cat}</span>}
                        </div>

                        {/* Sección de tallas */}
                        <div className={`${styles.formGroup} ${errors.tallas ? styles.hasError : ''}`}>
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
                                                        tallas: [...prev.tallas, size.nom_tal_pro]
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
                                {formData?.tallas?.map((size, index) => (
                                    <div key={index} className={styles.sizeTag}>
                                        {size}
                                        <button
                                            type="button"
                                            onClick={() => removeItem('tallas', index)}
                                            className={styles.tagRemove}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {errors.tallas && <span className={styles.errorText}>{errors.tallas}</span>}
                        </div>
                    </div>
                    
                    {/* Sección Integrada de Colores e Imágenes */}
                    <section className={styles.integratedSection}>
                        <section className={`${styles.formGroup} ${errors.colors ? styles.hasError : ''}`}>
                            <label><Palette size={16} /> Colores e Imágenes*</label>

                            {/* Lista de colores con sus imágenes */}
                            {formData?.colores?.map((color, colorIndex) => (
                                <section key={colorIndex} className={styles.colorImageGroup}>
                                    <section>
                                        <div className={styles.colorHeader}>
                                            <span
                                                className={styles.colorBadge}
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className={styles.colorName}>{color.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeItem('colores', colorIndex)}
                                                className={styles.tagRemove}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>

                                        {/* Input para agregar imágenes a este color específico */}
                                        <div className={styles.imageInputGroup}>
                                            <input
                                                type="text"
                                                value={currentImageColor || ''}
                                                onChange={(e) => setCurrentImageColor(e.target.value)}
                                                placeholder="URL de imagen para este color"
                                                className={styles.input}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => addColorAndImage(colorIndex)}
                                                className={styles.addButton}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </section>

                                    {/* Previsualización de imágenes para este color */}
                                    
                                    <section 
                                        className={styles.imagePreviewItem}
                                        style={{ borderColor: color.hex }}
                                        >
                                        <CheckImage
                                            src={color.url}
                                            alt={color.name}
                                            imgDefault={imgDefault}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newColors = [...formData.colors];
                                                newColors[colorIndex].splice(colorIndex, 1);
                                                setFormData({ ...formData, colors: newColors });
                                            }}
                                            className={styles.imageRemove}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </section>
                                </section>
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
                                                    colores: [...prev.colores, {
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
                            {errors.colores && <span className={styles.errorText}>{errors.colores}</span>}
                        </section>
                    </section>    
                </div>

                <footer className={styles.formActions}>
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
                </footer>
            </form>
            {isLoading && (
                <AdminLoadingScreen message='Cargando...' />
            )}
        </main>
    )
}