// Librarys 
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, Edit, Plus, Trash2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'

// Imports 
import { GetData, ModifyData, PostData } from '../../../Utils/Requests'
import { CheckImage, errorStatusHandler, searchCustomFilter, searchFilter, showAlert, showAlertLoading } from '../../../Utils/utils'

// Import styles
import styles from './ProductEdit.module.css'

// Component 
export const ProductEdit = ({ URL = '', imgDefault = '' }) => {
  // Dynamic vars
  const [categories, setCategories] = useState(null)
  const [allSizes, setAllSizes] = useState(null)
  const [allColors, setAllColors] = useState(null)
  const [brands, setBrands] = useState(null)
  const [inv, setInv] = useState(null)
  const [almcInv, setAlmcInv] = useState(null)
  const [imgExpand, setImgExpand] = useState(null)
  const [nameAdd, setNameAdd] = useState(null)
  const [showDropDown, setShowDropDown] = useState(null)
  const [showDropDownTwo, setShowDropDownTwo] = useState(null)
  const [editingColorIdx, setEditingColorIdx] = useState(null)
  const [editingInvIdx, setEditingInvIdx] = useState(null)

  // Vars 
  const navigate = useNavigate()
  const formRef = useRef(null)
  const ID = localStorage.getItem('id_pro') || 0
  let didFetch = false

  // Form config principal (Producto)
  const {
    register: registerProduct,
    handleSubmit: handleSubmitProduct,
    formState: { errors: errorsProduct },
    reset: resetProduct,
    getValues: getValuesProduct,
    watch: watchProduct,
    setValue: setValueProduct
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      nom_pro: '',
      nom_cat_pro: '',
      mar_pro: '',
      pre_ori_pro: 0,
      des_pre_pro: 0,
      pre_pro: 0,
      sta_pro: 'DISPONIBLE',
      onSale: false,
      des_pro: '',
      colors: [],
      inv: []
    }
  })

  // Form config para colores (agregar/editar)
  const {
    register: registerColor,
    handleSubmit: handleSubmitColor,
    formState: { errors: errorsColor },
    reset: resetColor,
    watch: watchColor
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      nom_col: '',
      hex_col: '#ffffff',
      url_img: '',
      nom_img: ''
    }
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

        // Setear valores en el formulario principal
        resetProduct(data[0])
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

  // Manejador para agregar o editar color
  const onSubmitColor = (data) => {
    const colorData = {
      nom_col: data.nom_col,
      hex_col: data.hex_col,
      url_img: data.url_img,
      nom_img: `${watchProduct('nom_pro').split(' ')?.[0] || ''}${data.nom_col || ''}`
    }

    const currentColors = watchProduct('colors') || []

    if (editingColorIdx !== null) {
      // Editar color existente
      const updatedColors = [...currentColors]
      updatedColors[editingColorIdx] = colorData
      setValueProduct('colors', updatedColors)
      showAlert('Éxito', 'Color actualizado correctamente', 'success')
    } else {
      // Agregar nuevo color
      setValueProduct('colors', [...currentColors, colorData])
      showAlert('Éxito', 'Color agregado correctamente', 'success')
    }

    // Limpiar formulario
    resetColor()
    setNameAdd(null)
    setEditingColorIdx(null)
  }

  // Función para abrir modal de edición de color
  const openEditColor = (idx) => {
    const color = watchProduct('colors')[idx]
    resetColor({
      nom_col: color.nom_col,
      hex_col: color.hex_col,
      url_img: color.url_img,
      nom_img: color.nom_img
    })
    setEditingColorIdx(idx)
    setNameAdd('Color')
  }

  // Función para eliminar color
  const deleteColor = (idx) => {
    const updatedColors = watchProduct('colors').filter((_, i) => i !== idx)
    setValueProduct('colors', updatedColors)
    showAlert('Éxito', 'Color eliminado correctamente', 'success')
  }

  const onSubmit = async () => {
    try {
      const allData = getValuesProduct()
      showAlertLoading('Cargando...', 'Por favor espera', 'info')
      const mod = await ModifyData(`${URL}/products/modify`, allData)
      if (mod.success) {
        showAlert('Producto Modificado', 'El producto ha sido modificado satisfactoriamente', 'success')
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
        <h2>{watchProduct('nom_pro') || 'Producto'}</h2>
        <span style={{ display: 'flex', gap: '0.5rem' }}>
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
          {/* activar submit del formulario principal */}
          <span>
            <button
              type="submit"
              className={'backButton'}
              onClick={() => formRef.current?.requestSubmit()}
            >
              <Check />
              Guardar Cambios
            </button>
          </span>
        </span>
      </header>

      <main className={styles.form}>
        <form ref={formRef} onSubmit={handleSubmitProduct(onSubmit)}>
          <section className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="nom_pro">Nombre del Producto</label>
              <input
                type="text"
                id="nom_pro"
                className={styles.input}
                placeholder="Nombre del producto"
                {...registerProduct('nom_pro', { required: 'El nombre es requerido' })}
              />
              {errorsProduct.nom_pro && (
                <span style={{ color: 'red', fontSize: '0.875rem' }}>
                  {errorsProduct.nom_pro.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="cat_pro">Categoría</label>
              <select
                id="cat_pro"
                className={styles.select}
                {...registerProduct('nom_cat_pro', { required: 'La categoría es requerida' })}
                onChange={(e) => {
                  const value = e.target.value
                  const cat = categories?.filter(c => c.nom_cat_pro === value)
                  setValueProduct('nom_cat_pro', value)
                  // Opcional: si necesitas guardar el slug
                  // setValueProduct('slug', cat?.[0]?.slug)
                }}
              >
                <option value="">Seleccione una categoría</option>
                {categories?.map(category => (
                  <option key={category.id_cat_pro} value={category.nom_cat_pro}>
                    {category.nom_cat_pro}
                  </option>
                ))}
              </select>
              {errorsProduct.nom_cat_pro && (
                <span style={{ color: 'red', fontSize: '0.875rem' }}>
                  {errorsProduct.nom_cat_pro.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="mar_pro">Marca</label>
              <select
                id="mar_pro"
                className={styles.select}
                {...registerProduct('mar_pro', { required: 'La marca es requerida' })}
              >
                <option value="">Seleccione una marca</option>
                {brands?.map(brand => (
                  <option key={brand.id_mar} value={brand.id_mar}>
                    {brand.nom_mar}
                  </option>
                ))}
              </select>
              {errorsProduct.mar_pro && (
                <span style={{ color: 'red', fontSize: '0.875rem' }}>
                  {errorsProduct.mar_pro.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="pre_ori_pro">Precio Original ($)</label>
              <input
                type="number"
                id="pre_ori_pro"
                className={styles.input}
                min="0"
                step="0.01"
                {...registerProduct('pre_ori_pro', {
                  required: 'El precio original es requerido',
                  min: { value: 0, message: 'El precio debe ser mayor a 0' }
                })}
              />
              {errorsProduct.pre_ori_pro && (
                <span style={{ color: 'red', fontSize: '0.875rem' }}>
                  {errorsProduct.pre_ori_pro.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="des_pre_pro">Descuento (%)</label>
              <input
                type="number"
                id="des_pre_pro"
                className={styles.input}
                min="0"
                max="100"
                {...registerProduct('des_pre_pro', {
                  min: { value: 0, message: 'El descuento debe ser mayor o igual a 0' },
                  max: { value: 100, message: 'El descuento no puede ser mayor a 100' }
                })}
              />
              {errorsProduct.des_pre_pro && (
                <span style={{ color: 'red', fontSize: '0.875rem' }}>
                  {errorsProduct.des_pre_pro.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="pre_pro">Precio Final ($)</label>
              <input
                type="number"
                id="pre_pro"
                className={`${styles.input} ${styles.readOnly}`}
                value={watchProduct('pre_pro') || 0}
                readOnly
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="sta_pro">Estado</label>
              <select
                id="sta_pro"
                className={styles.select}
                {...registerProduct('sta_pro', { required: 'El estado es requerido' })}
              >
                <option value="DISPONIBLE">Disponible</option>
                <option value="NO-DISPONIBLE">No Disponible</option>
              </select>
              {errorsProduct.sta_pro && (
                <span style={{ color: 'red', fontSize: '0.875rem' }}>
                  {errorsProduct.sta_pro.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  {...registerProduct('onSale')}
                />
                <span>En venta</span>
              </label>
            </div>

            <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
              <label className={styles.label} htmlFor="des_pro">Descripción</label>
              <textarea
                id="des_pro"
                className={styles.textArea}
                rows="4"
                placeholder="Descripción del producto"
                {...registerProduct('des_pro', { required: 'La descripción es requerida' })}
              />
              {errorsProduct.des_pro && (
                <span style={{ color: 'red', fontSize: '0.875rem' }}>
                  {errorsProduct.des_pro.message}
                </span>
              )}
            </div>
          </section>
        </form>
        <aside className={`${styles.formGroup} ${styles.formGroupFullWidth} ${styles.formGroupFullWidthTwo}`}>
          <header className={styles.headerAside}>
            <label className={styles.label}><h1>Colores</h1></label>
            <span
              style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <button
                type='button'
                className='backButton'
                onClick={() => {
                  setNameAdd('Color')
                  setEditingColorIdx(null)
                  resetColor()
                }}
              >
                <Plus />
                Añadir
              </button>
            </span>
          </header>
          <section className={styles.formGrid}>
            {watchProduct('colors')?.map((col, idx) => (
              <div
                key={idx + 99}
                className={styles.formGroup}
              >
                <span className={styles.formSpan}>
                  <span>
                    <label className={styles.label}>
                      {col.nom_col}
                    </label>
                    <input
                      type="color"
                      value={col.hex_col}
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
                  <span style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type='button'
                      className='backButton'
                      onClick={() => openEditColor(idx)}
                      title='Editar'
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      type='button'
                      className='deleteButton'
                      onClick={() => deleteColor(idx)}
                      title='Eliminar'
                    >
                      <Trash2 size={18} />
                    </button>
                  </span>
                </span>
              </div>
            ))}
          </section>

          <hr className='separator' />

          {/* formulario para añadir/editar color */}
          {nameAdd === 'Color' && (
            <aside className={styles.formAside}>
              <header className={styles.headerAside}>
                <label className={styles.label}>
                  <h3>{editingColorIdx !== null ? 'Editar' : 'Añadir'} {nameAdd}</h3>
                </label>
                <button
                  type='button'
                  className={'deleteButton'}
                  onClick={() => {
                    setNameAdd(null)
                    setEditingColorIdx(null)
                    resetColor()
                  }}
                >
                  <X />
                  Cancelar
                </button>
              </header>
              <form onSubmit={handleSubmitColor((data) => { onSubmitColor(data) })}>
                <section className={styles.formGridTwo}>
                  <span className={styles.formGridTwoSpan}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Color*</label>
                      <input
                        type="text"
                        placeholder="Ingrese un color"
                        className={styles.input}
                        {...registerColor('nom_col', { required: 'El color es requerido' })}
                        onClick={() => setShowDropDown(!showDropDown)}
                      />
                      {errorsColor.nom_col && (
                        <span style={{ color: 'red', fontSize: '0.875rem' }}>
                          {errorsColor.nom_col.message}
                        </span>
                      )}
                      {showDropDown && (
                        <div className="dropdown">
                          {allColors?.map((col, index) => (
                            <div
                              key={index + 9082}
                              className="dropdown-item"
                              onClick={() => {
                                resetColor({
                                  nom_col: col.nom_col,
                                  hex_col: col.hex_col,
                                  url_img: watchColor('url_img'),
                                  nom_img: watchColor('nom_img')
                                })
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
                        type='color'
                        {...registerColor('hex_col', { required: 'El color hex es requerido' })}
                      />
                      {errorsColor.hex_col && (
                        <span style={{ color: 'red', fontSize: '0.875rem' }}>
                          {errorsColor.hex_col.message}
                        </span>
                      )}
                    </div>
                  </span>

                  <span className={styles.formGridTwoSpan}>
                    <div className={`${styles.formGroup} expand`}>
                      <label className={styles.label}>Imagen*</label>
                      <input
                        type="text"
                        placeholder='Url de imagen'
                        className={styles.input}
                        {...registerColor('url_img', { required: 'La imagen es requerida' })}
                      />
                      {errorsColor.url_img && (
                        <span style={{ color: 'red', fontSize: '0.875rem' }}>
                          {errorsColor.url_img.message}
                        </span>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <picture
                        style={watchColor('url_img') ? { cursor: 'zoom-in' } : { cursor: 'normal' }}
                        onClick={() => watchColor('url_img') && setImgExpand(watchColor('url_img'))}
                      >
                        <CheckImage
                          className={styles.imgColor}
                          src={watchColor('url_img')}
                          imgDefault={imgDefault}
                        />
                      </picture>
                    </div>
                  </span>
                </section>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type='submit'
                    className='backButton'
                  >
                    <Check />
                    {editingColorIdx !== null ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </form>
            </aside>
          )}
        </aside>
        <aside className={`${styles.formGroup} ${styles.formGroupFullWidth} ${styles.formGroupFullWidthTwo}`}>
          <header className={styles.headerAside}>
            <label className={styles.label}><h1>Inventario</h1></label>
            <span
              style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <select
                name="filter"
                id="filter"
                className={styles.select}
                onChange={(e) => {
                  const term = e.target.value
                  const filterData = searchCustomFilter(term, almcInv, ['stock'], '<=')
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
                  const filterData = searchFilter(term, almcInv, ['nom_col', 'size', 'hex_col', 'mar_pro'])
                  if (filterData) setInv(filterData)
                }}
              />
              <button
                type='button'
                className='backButton'
                onClick={() => {
                  setNameAdd('Inventario')
                  setEditingInvIdx(null)
                }}
              >
                <Plus />
                Registrar Inventario
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
                      value={col.hex_col}
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
                  <span style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type='button'
                      className='backButton'
                      onClick={() => showAlert('Info', 'Funcionalidad en desarrollo, Te me calmas!', 'info')}
                      title='Editar'
                    >
                      <Edit size={18} />
                    </button>
                  </span>
                </span>
              </div>
            ))}
          </section>

          <hr className='separator' />

          {nameAdd === 'Inventario' && (
            <aside className={styles.formAside}>
              <header className={styles.headerAside}>
                <label className={styles.label}>
                  <h3>{editingInvIdx !== null ? 'Editar' : 'Añadir'} {nameAdd}</h3>
                </label>
                <button
                  type='button'
                  className={'deleteButton'}
                  onClick={() => {
                    setNameAdd(null)
                    setEditingInvIdx(null)
                    resetInv()
                  }}
                >
                  <X />
                  Cancelar
                </button>
              </header>
              <form onSubmit={handleSubmitInv(onSubmitInv)}>
                <section className={styles.formGridTwo}>
                  <span className={styles.formGridTwoSpan}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Color*</label>
                      <input
                        type="text"
                        placeholder="Ingrese un color"
                        className={styles.input}
                        {...registerInv('nom_col', { required: 'El color es requerido' })}
                        onClick={() => setShowDropDown(!showDropDown)}
                      />
                      {errorsInv.nom_col && (
                        <span style={{ color: 'red', fontSize: '0.875rem' }}>
                          {errorsInv.nom_col.message}
                        </span>
                      )}
                      {showDropDown && (
                        <div className="dropdown">
                          {allColors?.map((col, index) => (
                            <div
                              key={index + 9082}
                              className="dropdown-item"
                              onClick={() => {
                                resetInv({
                                  nom_col: col.nom_col,
                                  hex_col: col.hex_col,
                                  size: watchInv('size'),
                                  stock: watchInv('stock')
                                })
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
                        type='color'
                        {...registerInv('hex_col', { required: 'El color hex es requerido' })}
                      />
                      {errorsInv.hex_col && (
                        <span style={{ color: 'red', fontSize: '0.875rem' }}>
                          {errorsInv.hex_col.message}
                        </span>
                      )}
                    </div>
                  </span>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Talla*</label>
                    <input
                      type="text"
                      placeholder="Ingrese una talla"
                      className={styles.input}
                      {...registerInv('size', { required: 'La talla es requerida' })}
                      onClick={() => setShowDropDownTwo(!showDropDownTwo)}
                    />
                    {errorsInv.size && (
                      <span style={{ color: 'red', fontSize: '0.875rem' }}>
                        {errorsInv.size.message}
                      </span>
                    )}
                    {showDropDownTwo && (
                      <div className="dropdown">
                        {allSizes?.map((tal, index) => (
                          <div
                            key={index + 9082}
                            className="dropdown-item"
                            onClick={() => {
                              resetInv({
                                nom_col: watchInv('nom_col'),
                                hex_col: watchInv('hex_col'),
                                size: tal.nom_tal_pro,
                                stock: watchInv('stock')
                              })
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
                    <label className={styles.label}>Cantidad*</label>
                    <input
                      type='number'
                      placeholder='Cantidad de stock'
                      className={styles.input}
                      min="0"
                      {...registerInv('stock', {
                        required: 'La cantidad es requerida',
                        min: { value: 0, message: 'La cantidad debe ser mayor o igual a 0' }
                      })}
                    />
                    {errorsInv.stock && (
                      <span style={{ color: 'red', fontSize: '0.875rem' }}>
                        {errorsInv.stock.message}
                      </span>
                    )}
                  </div>
                </section>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type='submit'
                    className='backButton'
                  >
                    <Check />
                    Guardar
                  </button>
                </div>
              </form>
            </aside>
          )}
        </aside>
      </main>
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