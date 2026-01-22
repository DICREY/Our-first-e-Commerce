// Librarys 
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, Plus, X } from 'lucide-react'

// Imports 
import { GetData, ModifyData, PostData } from '../../../Utils/Requests'
import { CheckImage, errorStatusHandler, searchCustomFilter, searchFilter, showAlert, showAlertLoading } from '../../../Utils/utils'

// Import styles
import styles from './ProductEdit.module.css'
import { useForm } from 'react-hook-form'

// Component 
export const ProductEdit = ({ URL = '', imgDefault = '' }) => {
  // Dynamic vars
  const [ formData, setFormData ] = useState(null)
  const [ categories, setCategories ] = useState(null)
  const [ allSizes, setAllSizes ] = useState(null)
  const [ allColors, setAllColors ] = useState(null)
  const [ brands, setBrands ] = useState(null)
  const [ inv, setInv ] = useState(null)
  const [ almcInv, setAlmcInv ] = useState(null)
  const [ currentCol, setCurrentCol ] = useState(null)
  const [ currentInv, setCurrentInv ] = useState(null)
  const [ imgExpand, setImgExpand ] = useState(null)
  const [ nameAdd, setNameAdd ] = useState(null)
  const [ showDropDown, setShowDropDown ] = useState(null)
  const [ showDropDownTwo, setShowDropDownTwo ] = useState(null)
  
  // Vars 
  const navigate = useNavigate()
  const ID = localStorage.getItem('id_pro') || 0
  let didFetch = false

  // Form config 
  const { register, handleSubmit, formState: { errors } } = useForm({ 
    mode: 'onChange',
    defaultValues: formData
   })

  // Requests
  const fetchProduct = async () => {
    if (didFetch) return
    try {
      const data = await PostData(`${URL}/products/by`, { by: ID })
      didFetch = true
      if (data && data?.[0]) {
        if (!data[0].inv) data[0].inv = []
        if (!data[0]?.colors) data[0].colors = []
        
        setFormData(data[0])
        setAlmcInv(data[0].inv)
        setInv(data[0].inv)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  const GetCategories = async () => {
    try {
      const got = await GetData(`${URL}/products/categories`)
      if (got) {
        setCategories(got)
      }
    } catch (err) {      
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  const GetColors = async () => {
    try {
      const got = await GetData(`${URL}/products/colors`)
      if (got) setAllColors(got)
    } catch (err) {      
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  const GetSizes = async () => {
    try {
      const got = await GetData(`${URL}/products/sizes`)
      if (got) setAllSizes(got)

      const gotBrands = await GetData(`${URL}/products/brands`)
      if (gotBrands) setBrands(gotBrands)
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

  useEffect(() => {
    fetchProduct()
    GetCategories()
    GetColors()
    GetSizes()
    GetBrands()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleChangeNewCol = (e) => {
    const { name, value } = e.target
    setCurrentCol(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleChangeNewInv = (e) => {
    const { name, value } = e.target
    setCurrentInv(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const dataMod = { ...formData }
      showAlertLoading('Cargando...', 'Por favor espera', 'info')
      const mod = await ModifyData(`${URL}/products/modify`,dataMod)
      if (mod.success){
        showAlert('Producto Modificado','El producto ha sido modificado satisfactoriamente','success')
        fetchProduct()
      } else showAlert('Error', 'No se ha recibido respuesta del servidor', 'error')
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  return (
    <main className={styles.formContainer}>
      <header className={styles.formHeader}>
        <h2>{formData?.nom_pro || 'Producto'}</h2>
        <span>
          <button
            type='button'
            className='backButton'
            onClick={() => navigate(-1)}
          >
            <ChevronLeft />
            Atrás
          </button>
        </span>
      </header>

      <form className={styles.form} onSubmit={onSubmit}>  
        <section className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="nom_pro">Nombre del Producto</label>
            <input
              type="text"
              id="nom_pro"
              name="nom_pro"
              className={styles.input}
              defaultValue={formData?.nom_pro || ''}
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
              value={formData?.nom_cat_pro}
              onChange={(e) => {
                const { name, value } = e.target
                const cat = categories?.filter(c => c.nom_cat_pro === value)
                setFormData(prev => ({
                  ...prev,
                  nom_cat_pro: value,
                  slug: cat?.[0]?.slug
                }))
              }}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories?.map(category => (
                <option key={category.id_cat_pro} value={category.nom_cat_pro}>
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
              defaultValue={formData?.pre_ori_pro}
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
              defaultValue={formData?.des_pre_pro}
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
              defaultValue={formData?.pre_pro}
              readOnly
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="sta_pro">Estado</label>
            <select
              id="sta_pro"
              name="sta_pro"
              className={styles.select}
              defaultValue={formData?.sta_pro}
              onChange={handleChange}
              required
            >
              <option value="DISPONIBLE">Disponible</option>
              <option value="NO-DISPONIBLE">No Disponible</option>
            </select>
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
              <span>En venta</span>
            </label>
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label className={styles.label} htmlFor="des_pro">Descripción</label>
            <textarea
              id="des_pro"
              name="des_pro"
              className={styles.textArea}
              defaultValue={formData?.des_pro}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <aside className={`${styles.formGroup} ${styles.formGroupFullWidth} ${styles.formGroupFullWidthTwo}`}>
            <header className={styles.headerAside}>
              <label className={styles.label}><h1>Inventario</h1></label>
              <span
                style={{ display: 'flex',alignItems: 'center', gap: '1rem'}}
              >
                <select 
                  name="filter"
                  id="filter"
                  className={styles.select}
                  onChange={(e) => {
                    const term = e.target.value
                    const filterData = searchCustomFilter(term,almcInv,['stock'],'<=')
                    if (filterData) setInv(filterData)
                  }}
                >
                  <option value="">Filtrar</option>
                  <option value={10}>Bajo Stock (10)</option>
                  <option value={0}>Sin Stock (0)</option>
                </select>
                <input
                  type='search'
                  className={styles.input}
                  placeholder='Filtrar por color,talla o marca'
                  onChange={(e) => {
                    const term = e.target.value
                    const filterData = searchFilter(term,almcInv,['nom_col','size','hex_col','mar_pro'])
                    if (filterData) setInv(filterData)
                  }}
                />
                <button
                  type='button'
                  className='backButton'
                  onClick={() => setNameAdd('Inventario')}
                >
                  <Plus />
                  Añadir
                </button>
              </span>
            </header>
            <section className={styles.formGrid}>
              {inv?.map((col, idx) => (
                <div 
                  key={idx + 89}
                  className={styles.formGroup}
                >
                  <span className={styles.formSpan}>
                    <span>
                      <label className={styles.label}>
                        {col.stock}
                      </label>
                      <label className={styles.label}>
                        {col.nom_col}
                      </label>
                      {col.size}
                      <input
                        type="color"
                        defaultValue={col.hex_col}
                        disabled
                      />
                    </span>
                    <picture 
                      style={{ cursor: 'zoom-in' }}
                      onClick={() => setImgExpand(col.url_img)}
                    >
                      <CheckImage 
                        className={styles.imgColor}
                        src={col.url_img}
                        imgDefault={imgDefault}
                      />
                    </picture>
                  </span>
                </div>
              ))}
            </section>
            
            <hr className='separator' />
              
            {nameAdd === 'Color' && (
              <aside className={styles.formAside}>
                <header className={styles.headerAside}>
                  <label className={styles.label}><h3>Añadir {nameAdd}</h3></label>
                  <button
                    type='button'
                    className={'backButton'}
                    onClick={() => {
                      formData?.colors?.push(currentCol)
                    }}
                  >
                    <Check />
                    Guardar
                  </button>
                </header>
                <section className={styles.formGridTwo}>
                  <span className={styles.formGridTwoSpan}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Color*</label>
                      <input
                        name="nom_col"
                        type="text"
                        value={currentCol?.nom_col || ''}
                        onChange={(e) => setCurrentCol(prev => ({ ...prev, nom_col: e.target.value }))}
                        placeholder="Ingrese un color"
                        className={styles.input}
                        onClick={() => setShowDropDown(!showDropDown)}
                      >
                      </input>
                      {showDropDown && (
                        <div className="dropdown">
                            {allColors?.map((col, index) => (
                                <div
                                    key={index + 9082}
                                    className="dropdown-item"
                                    onClick={() => {
                                        setCurrentCol(prev => ({
                                            ...prev,
                                            nom_col: col.nom_col,
                                            hex_col: col.hex_col
                                        }))
                                        setShowDropDown(false)
                                    }}
                                >
                                    <div className="dropdown-contenido">
                                        <div className="dropdown-nombre">{col.nom_col}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Hex color*</label>
                      <input
                        name="hex_color"
                        type='color'
                        value={currentCol?.hex_col || '#ffffff'}
                      />
                    </div>
                  </span>

                  <span className={styles.formGridTwoSpan}>
                    <div className={`${styles.formGroup} expand`}>
                      <label className={styles.label}>Imagen*</label>
                      <input
                        name="url_img"
                        placeholder='Url de imagen'
                        onChange={(e) => {
                          setCurrentCol(prev => ({
                            ...prev,
                            nom_img: `${formData.nom_pro.split(' ')?.[0] || ''}${currentCol?.nom_col || ''}`
                          }))
                          handleChangeNewCol(e)
                        }}
                        className={styles.input}
                      />  
                    </div>
                    <div className={styles.formGroup}>
                      <picture
                        style={currentCol?.url_img? { cursor: 'zoom-in' }: { cursor: 'normal' }}
                        onClick={() => setImgExpand(currentCol?.url_img || '')}
                      >
                        <CheckImage
                          className={styles.imgColor}
                          src={currentCol?.url_img}
                          imgDefault={imgDefault}
                        />
                      </picture>
                    </div>
                  </span>
                </section>
            </aside>
          )}

          {nameAdd === 'Inventario' && (
            <aside className={styles.formAside}>
                <header className={styles.headerAside}>
                  <label className={styles.label}><h3>Añadir {nameAdd}</h3></label>
                  <button
                    type='button'
                    className={'backButton'}
                    onClick={() => {
                      formData?.inv?.push(currentInv)
                    }}
                  >
                    <Check />
                    Guardar
                  </button>
                </header>
                <section className={styles.formGridTwo}>
                  <span className={styles.formGridTwoSpan}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Color*</label>
                      <input
                        name="nom_col"
                        type="text"
                        value={currentInv?.nom_col || ''}
                        onChange={(e) => setCurrentInv(prev => ({ ...prev, nom_col: e.target.value }))}
                        placeholder="Ingrese un color"
                        className={styles.input}
                        onClick={() => setShowDropDown(!showDropDown)}
                      >
                      </input>
                      {showDropDown && (
                        <div className="dropdown">
                            {allColors?.map((col, index) => (
                                <div
                                    key={index + 9082}
                                    className="dropdown-item"
                                    onClick={() => {
                                        setCurrentInv(prev => ({
                                            ...prev,
                                            nom_col: col.nom_col,
                                            hex_col: col.hex_col
                                        }))
                                        setShowDropDown(false)
                                    }}
                                >
                                    <div className="dropdown-contenido">
                                        <div className="dropdown-nombre">{col.nom_col}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Hex color*</label>
                      <input
                        name="hex_color"
                        type='color'
                        value={currentInv?.hex_col}
                      />
                    </div>
                  </span>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Talla*</label>
                    <input
                      name="size"
                      type="text"
                      value={currentInv?.size || ''}
                      onChange={(e) => setCurrentInv(prev => ({
                        ...prev, size: e.target.value,
                      }))}
                      placeholder="Ingrese una talla"
                      className={styles.input}
                      onClick={() => setShowDropDownTwo(!showDropDownTwo)}
                    >
                    </input>
                    {showDropDownTwo && (
                      <div className="dropdown">
                        {allSizes?.map((tal, index) => (
                          <div
                            key={index + 9082}
                            className="dropdown-item"
                            onClick={() => {
                              setCurrentInv(prev => ({
                                ...prev,
                                size: tal.nom_tal_pro,
                              }))
                              setShowDropDownTwo(false)
                            }}
                        >
                            <div className="dropdown-contenido">
                              <div className="dropdown-nombre">{tal.nom_tal_pro}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>cantidad*</label>
                    <input
                      name="stock"
                      type='number'
                      placeholder='Cantidad de stock'
                      className={styles.input}
                      onChange={handleChangeNewInv}
                      defaultValue={currentInv?.stock}
                    />
                  </div>
                </section>
            </aside>
          )}
          </aside>
        </section>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={`${styles.button} ${styles.saveButton}`}
          >
            <Check />
            Guardar Cambios
          </button>
        </div>
      </form>
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