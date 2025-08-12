// Librarys 
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Imports 
import { GetData, PostData } from '../../Utils/Requests'
import { errorStatusHandler, showAlert } from '../../Utils/utils'

// Import styles 
import styles from '../../styles/Products/ProductEdit.module.css'

// Component 
export const ProductEdit = ({ URL = '', imgDefault = '' }) => {
  // Dynamic vars
  const [formData, setFormData] = useState(null)
  const [categories, setCategories] = useState(null)
  const [sizes, setSizes] = useState(null)
  const [colors, setColors] = useState(null)
  const [brands, setBrands] = useState(null)

  // Vars 
  const navigate = useNavigate()
  const ID = localStorage.getItem('id_pro') || 0
  let didFetch = false

  const fetchProduct = async () => {
    if (didFetch) return
    try {
      const data = await PostData(`${URL}/products/by`, { by: ID })
      didFetch = true
      if (data && data?.[0]) {
        setFormData(data[0])
        setColors(data[0].colors)
        setSizes(data[0].sizes)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  const GetCategories = async () => {
    try {
      const got = await GetData(`${URL}/products/categories`)
      if (got && got) {
        setCategories(got)
      }
    } catch (err) {      
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  useEffect(() => {
    fetchProduct()
    GetCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleColorChange = (colorId, isChecked) => {
    setFormData(prev => {
      const newColors = isChecked
        ? [...prev.colors, colorId]
        : prev.colors?.filter(id => id !== colorId)
      return { ...prev, colors: newColors }
    })
  }

  const handleSizeChange = (sizeId, isChecked) => {
    setFormData(prev => {
      const newSizes = isChecked
        ? [...prev.sizes, sizeId]
        : prev.sizes.filter(id => id !== sizeId)
      return { ...prev, sizes: newSizes }
    })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      nom_img: file.name,
      url_img: URL.createObjectURL(file)
    }))
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2>{ID? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="nom_pro">Nombre del Producto</label>
            <input
              type="text"
              id="nom_pro"
              name="nom_pro"
              className={styles.input}
              value={formData?.nom_pro}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="cat_pro">Categoría</label>
            <select
              id="cat_pro"
              name="cat_pro"
              className={styles.select}
              value={formData?.id_cat_pro}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {console.log(formData)}
              {categories?.map(category => (
                <option key={category.id_cat_pro} value={category.id_cat_pro}>
                  {category.nom_cat_pro}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="mar_pro">Marca</label>
            <select
              id="mar_pro"
              name="mar_pro"
              className={styles.select}
              value={formData?.mar_pro}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una marca</option>
              {brands?.map(brand => (
                <option key={brand.id_mar} value={brand.id_mar}>
                  {brand.nom_mar}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="pre_ori_pro">Precio Original ($)</label>
            <input
              type="number"
              id="pre_ori_pro"
              name="pre_ori_pro"
              className={styles.input}
              value={formData?.pre_ori_pro}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="des_pre_pro">Descuento (%)</label>
            <input
              type="number"
              id="des_pre_pro"
              name="des_pre_pro"
              className={styles.input}
              value={formData?.des_pre_pro}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="pre_pro">Precio Final ($)</label>
            <input
              type="number"
              id="pre_pro"
              name="pre_pro"
              className={`${styles.input} ${styles.readOnly}`}
              value={formData?.pre_pro}
              readOnly
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                name="onSale"
                className={styles.checkbox}
                checked={formData?.onSale}
                onChange={handleChange}
              />
              <span>En oferta</span>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="sta_pro">Estado</label>
            <select
              id="sta_pro"
              name="sta_pro"
              className={styles.select}
              value={formData?.sta_pro}
              onChange={handleChange}
              required
            >
              <option value="DISPONIBLE">Disponible</option>
              <option value="NO-DISPONIBLE">No Disponible</option>
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label className={styles.label} htmlFor="des_pro">Descripción</label>
            <textarea
              id="des_pro"
              name="des_pro"
              className={styles.textArea}
              value={formData?.des_pro}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label className={styles.label}>Colores Disponibles</label>
            <div className={styles.colorGrid}>
              {colors?.map((color, idx) => (
                <div key={idx + 12} className={styles.colorOption}>
                  <input
                    type="checkbox"
                    id={`color-${color.nom_col}`}
                    className={styles.checkbox}
                    checked={formData?.colors.includes(color.nom_col)}
                    onChange={(e) => handleColorChange(color.nom_col, e.target.checked)}
                  />
                  <label htmlFor={`color-${color.nom_col}`} className={styles.colorLabel}>
                    <span className={styles.colorCircle} style={{ backgroundColor: color.hex_col }} />
                    {color.nom_col}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label className={styles.label}>Tallas Disponibles</label>
            <div className={styles.sizeGrid}>
              {sizes?.map((size, idx) => (
                <div key={idx + 12} className={styles.sizeOption}>
                  <input
                    type="checkbox"
                    id={`size-${idx}`}
                    className={styles.checkbox}
                    checked={formData?.sizes.includes(size)}
                    onChange={(e) => handleSizeChange(size, e.target.checked)}
                  />
                  <label htmlFor={`size-${size}`} className={styles.sizeLabel}>
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label className={styles.label}>Imágenes del Producto</label>
            <div className={styles.imageUploadContainer}>
              <label htmlFor="image-upload" className={styles.imageUploadLabel}>
                <span className={styles.uploadIcon}>+</span>
                <span>Subir imágenes</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>

              <div className={styles.imagePreviewContainer}>
                {formData?.images?.map((image, index) => (
                  <div key={index} className={styles.imagePreview}>
                    <img src={image.url_img} alt={image.nom_img} />
                    <button
                      type="button"
                      className={styles.removeImageButton}
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={`${styles.button} ${styles.cancelButton}`}
            // onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`${styles.button} ${styles.saveButton}`}
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  )
}