// Librarys 
import React, { useEffect, useState } from 'react'
import {
    Package, Tag, List, Palette,
    DollarSign, Type, AlignLeft,
    X, Save, Plus, Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

// Imports 
import { CheckImage, errorStatusHandler, showAlert, showAlertLoading } from '../../../Utils/utils'
import { GetData, PostData } from '../../../Utils/Requests'
import AdminLoadingScreen from '../../../components/Global/Loading'

// Import styles 
import styles from './ProductRegister.module.css'

// Component 
export const ProductRegister = ({ URL = '', imgDefault = '' }) => {
    const [ currentSize, setCurrentSize ] = useState('')
    const [ categories, setCategories ] = useState(null)
    const [ brands, setBrands ] = useState(null)
    const [ sizes, setSizes ] = useState(null)
    const [ colors, setColors ] = useState([])
    const [ showDropDown, setShowDropDown ] = useState(null)
    const [ imgExpand, setImgExpand ] = useState(null)
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ isLoading, setIsLoading ] = useState()
    const [ currentColor, setCurrentColor ] = useState({ 
        nom_col: '',
        hex_col: '#000000',
        url_img: '',
        nom_img: '',
        tallas: []
    })

    // Vars
    const navigate = useNavigate()

    // Form config 
    const { register, setValue, getValues, handleSubmit, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: {
            nom_pro: '',
            pre_ori_pro: '',
            pre_pro: '',
            des_pro: '',
            onSale: false,
            nom_cat: '',
            nom_mar: '',
            colores: [],
        }
    })

    // Functions 
    const addSize = () => {
        if (!currentSize) return

        setCurrentColor({
            ...currentColor,
            tallas: [...currentColor?.tallas, currentSize]
        })

        setCurrentSize('')
    }

    const removeItem = (type, index) => {
        setValue(type, getValues(type).filter((_, i) => i !== index))
    }

    // Send Request 
    const onSubmit = async (data) => {
        setValue('colores', colors)
        const endData = getValues()
        setIsSubmitting(true)
        showAlertLoading('Cargando...', 'Por favor espera', 'info')

        try {
            const response = await PostData(`${URL}/products/register`, endData)
            if (response?.success) {
                setIsSubmitting(false)
                setIsLoading(false)
                showAlert('Éxito', 'Producto registrado exitosamente', 'success')
                setTimeout(() => {
                    navigate('/admin/products')
                }, 3000)
            } else showAlert('Error', 'No se ha recibido respuesta del servidor', 'error')
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

    const GetBrands = async () => {
        try {      
          const gotBrands = await GetData(`${URL}/products/brands`)
          if (gotBrands) setBrands(gotBrands)
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
    
    useEffect(() => {
        GetCat()
        GetSizes()
        GetBrands()
    }, [])

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>
                    <Package size={20} /> Nuevo Producto
                </h2>
                <p className={styles.subtitle}>Complete los detalles del producto</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.formGrid}>
                    {/* Columna izquierda - Información básica */}
                    <div className={styles.formColumn}>
                        <div className={`${styles.formGroup} ${errors.nom_pro ? styles.hasError : ''}`}>
                            <label><Type size={16} /> Nombre del Producto*</label>
                            <input
                                type="text"
                                name="nom_pro"
                                placeholder="Nombre del producto"
                                className={styles.input}
                                {...register('nom_pro', {
                                    required: 'El nombre del producto es obligatorio', 
                                    minLength: {
                                        value: 3,
                                        message: 'El nombre debe tener al menos 3 caracteres'
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: 'El nombre no puede exceder los 100 caracteres'
                                    }
                                })}
                                
                            />
                            {errors.nom_pro && (
                                <p id="nom_pro-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.nom_pro.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                <Tag size={16} /> En oferta
                                <input
                                    type="checkbox"
                                    name="onSale"
                                    className={styles.toggleSwitch}
                                    {...register('onSale')}
                                />
                            </label>
                        </div>

                        <div className={`${styles.formGroup} ${errors.nom_mar ? styles.hasError : ''}`}>
                            <label><List size={16} /> Marca*</label>
                            <select
                                name="nom_mar"
                                className={styles.select}
                                {...register('nom_mar', {
                                    required: 'La marca es obligatoria'
                                })}
                            >
                                <option value="">Seleccionar marca</option>
                                {brands?.map((cat, idx) => (
                                    <option key={idx + 989} value={cat.nom_mar}>{cat.nom_mar}</option>
                                ))}
                            </select>
                            {errors.nom_mar && (
                                <p id="nom_mar-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.nom_mar.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label><AlignLeft size={16} /> Descripción</label>
                            <textarea
                                name="des_pro"
                                placeholder="Detalles del producto..."
                                rows="4"
                                className={styles.textarea}
                                {...register('des_pro', {
                                    maxLength: {
                                        value: 500,
                                        message: 'La descripción no puede exceder los 500 caracteres'
                                    },
                                })}
                            />
                            {errors.des_pro && (
                                <p id="des_pro-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.des_pro.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Columna derecha - Variantes y multimedia */}
                    <div className={styles.formColumn}>
                        <div className={`${styles.formGroup} ${errors.pre_pro ? styles.hasError : ''}`}>
                            <label><DollarSign size={16} /> Precio Original*</label>
                            <div className={styles.inputWithSymbol}>
                                <span>$</span>
                                <input
                                    type="number"
                                    name="pre_ori_pro"
                                    placeholder="Precio de compra"
                                    step="0.01"
                                    className={styles.input}
                                    {...register('pre_ori_pro', {
                                        required: 'El precio original es obligatorio',
                                        min: {
                                            value: 0,
                                            message: 'El precio no puede ser negativo'
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: 'El precio no puede exceder los 10 caracteres'
                                        }
                                    })}
                                />
                            </div>
                            {errors.pre_ori_pro && (
                                <p id="pre_ori_pro-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.pre_ori_pro.message}
                                </p>
                            )}
                        </div>

                        <div className={`${styles.formGroup} ${errors.pre_pro ? styles.hasError : ''}`}>
                            <label><DollarSign size={16} /> Precio*</label>
                            <div className={styles.inputWithSymbol}>
                                <span>$</span>
                                <input
                                    type="number"
                                    name="pre_pro"
                                    placeholder="Precio de venta"
                                    step="0.01"
                                    className={styles.input}
                                    {...register('pre_pro', {
                                        required: 'El precio es obligatorio',
                                        min: {
                                            value: 0,
                                            message: 'El precio no puede ser negativo'
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: 'El precio no puede exceder los 10 caracteres'
                                        }
                                    })}
                                />
                            </div>
                            {errors.pre_pro && (
                                <p id="pre_pro-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.pre_pro.message}
                                </p>
                            )}
                        </div>


                        <div className={`${styles.formGroup} ${errors.nom_cat ? styles.hasError : ''}`}>
                            <label><List size={16} /> Categoría*</label>
                            <select
                                name="nom_cat"
                                className={styles.select}
                                {...register('nom_cat', {
                                    required: 'La categoría es obligatoria',
                                    minLength: {
                                        value: 3,
                                        message: 'La categoría debe tener al menos 3 caracteres'
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'La categoría no puede exceder los 50 caracteres'
                                    }
                                })}
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories?.map((cat, idx) => (
                                    <option key={idx + 989} value={cat.nom_cat_pro}>{cat.nom_cat_pro}</option>
                                ))}
                            </select>
                            {errors.nom_cat && (
                                <p id="nom_cat-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.nom_cat.message}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    {/* Sección Integrada de Colores e Imágenes */}
                    <section className={styles.integratedSection}>
                        <section className={`${styles.formGroup} ${errors.colors ? styles.hasError : ''}`}>
                            <label><Palette size={16} /> Colores, Imágenes y Tallas*</label>

                            {/* Lista de colores con sus imágenes */}
                            {colors?.map((color, colorIndex) => {
                                return (
                                    <section key={colorIndex} className={styles.colorImageGroup}>
                                        <section>
                                            <div className={styles.colorHeader}>
                                                <span
                                                    className={styles.colorBadge}
                                                    style={{ backgroundColor: color.hex_col }} />
                                                <span className={styles.colorName}>{color.nom_col}</span>
                                                <button
                                                    type="button"
                                                    className={styles.tagRemove}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>

                                            {/* Input para agregar imágenes a este color específico */}
                                            <div className={styles.imageInputGroup}>
                                                <input
                                                    type="text"
                                                    placeholder="URL de imagen para este color"
                                                    className={styles.input}
                                                />
                                            </div>
                                        </section>

                                        {/* Previsualización de imágenes para este color */}
                                        <section
                                            className={styles.imagePreviewItem}
                                            style={{ borderColor: color.hex }}
                                        >
                                            <picture
                                                onClick={() => setImgExpand(color?.url_img || '')}
                                            >
                                                <CheckImage
                                                    src={colors?.[colorIndex].url_img}
                                                    alt={colors?.[colorIndex].nom_col}
                                                    imgDefault={imgDefault} />
                                            </picture>
                                            <button
                                                type="button"
                                                onClick={() => removeItem('colores', colorIndex)}
                                                className={styles.imageRemove}
                                            >
                                                <Trash2 />
                                            </button>
                                        </section>
                                    </section>
                                )
                            })}

                            {/* Input para agregar nuevo color */}
                            <div className={styles.formGrid}>
                                <div className={styles.formColumn}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="">Nombre del color*</label>
                                        <input
                                            type="text"
                                            value={currentColor.nom_col}
                                            onChange={(e) => setCurrentColor({ ...currentColor, nom_col: e.target.value })}
                                            placeholder="Nombre del color"
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="">Url de Imagen*</label>
                                        <input
                                            type="text"
                                            value={currentColor.url_img}
                                            onChange={(e) => setCurrentColor({ 
                                                ...currentColor,
                                                url_img: e.target.value,
                                                nom_img: `${currentColor?.nom_col?.split(' ')?.[0] || ''}${currentColor?.nom_col || ''}`
                                            })}
                                            placeholder="URL de imagen para este color"
                                            className={styles.input}
                                        />
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
                                                                setCurrentColor({
                                                                    ...currentColor,
                                                                    tallas: [...currentColor.tallas, size.nom_tal_pro]
                                                                })
                                                                
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
                                            {currentColor.tallas?.map((size, index) => (
                                                <div key={index} className={styles.sizeTag}>
                                                    {size}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newSizes = [...currentColor.tallas];
                                                            newSizes.splice(index, 1);
                                                            setCurrentColor({ ...currentColor, tallas: newSizes });
                                                        }}
                                                        className={styles.tagRemove}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className={styles.formColumn}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="">Preview de Imagen*</label>
                                        <section 
                                            className={styles.imagePreviewItem}
                                            style={{ borderColor: currentColor.hex_col, cursor: 'zoom-in' }}
                                            onClick={() => setImgExpand(currentColor?.url_img)}
                                        >
                                            <CheckImage
                                                src={currentColor.url_img}
                                                alt={currentColor.nom_col}
                                                imgDefault={imgDefault}
                                            />
                                        </section>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="">Codigo hex del color*</label>
                                        <div className={styles.colorPickerWrapper}>
                                            <input
                                                type="color"
                                                value={currentColor.hex_col}
                                                onChange={(e) => setCurrentColor({ ...currentColor, hex_col: e.target.value })}
                                            />
                                            <span>{currentColor.hex_col}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (currentColor?.nom_col && currentColor?.hex_col && currentColor?.url_img) {
                                        setColors( prev => [ ...prev , { ...currentColor }]);
                                        setCurrentColor({ nom_col: '', hex_col: '#ffffff', url_img: '', nom_img: '', tallas: [] });
                                    }
                                }}
                                className={styles.addButton}
                            >
                                <Plus size={16} /> Color
                            </button>
                            
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
            {imgExpand && (
                <picture 
                    onClick={() => setImgExpand(null)}
                    className='activeImg'
                >
                    <CheckImage
                        src={imgExpand}
                        imgDefault={imgDefault}
                    />
                </picture>
            )}
        </main>
    )
}