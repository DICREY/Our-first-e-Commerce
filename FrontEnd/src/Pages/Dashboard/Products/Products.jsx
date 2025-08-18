// Librarys 
import React, { useState, useEffect } from 'react'
import { Eye, Edit, Search, Filter, ChevronLeft, Plus } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

// Imports 
import { CheckImage, Discount, divideList, errorStatusHandler, formatNumber, searchFilter, showAlert } from '../../../Utils/utils'
import { GetData } from '../../../Utils/Requests'
import { Paginacion } from '../../../components/Global/Pagination/Paginacion'
import AdminLoadingScreen from '../../../components/Global/Loading'

// Import styles 
import styles from './ProductList.module.css'

// Component 
export const ProductList = ({ URL = '', imgDefault = '' }) => {
  // Vars 
  const navigate = useNavigate()
  let didFetch = false

  // Dynamic vars 
  const [products, setProducts] = useState(null)
  const [stats, setStats] = useState(null)
  const [productsAlmc, setProductsAlmc] = useState(null)
  const [loading, setLoading] = useState(() => didFetch?0:1)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(null)

  // Functions 
  const getStats = async () => {
    try {
      const got = await GetData(`${URL}/stats/general`)
      if (got) {
        setStats(got)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  const getProductCategories = async () => {
    try {
      const product = await GetData(`${URL}/products/categories`)
      if (product) setCategories(product)
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }
  
  const getProducts = async () => {
    try {
      if (didFetch) return
      const prods = await GetData(`${URL}/products/all`)
      if (prods) {
        didFetch = true
        setProducts(divideList(prods, 12))
        setProductsAlmc(prods)
        setLoading(false)
      }
    } catch (err) {
      didFetch = true
      setLoading(false)
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    getStats()
    getProductCategories()
    getProducts()
  }, [])

  useEffect(() => {
    if (productsAlmc) {
      let filteredData = [...productsAlmc]
      
      // Aplicar filtro de categoría
      if (selectedCategory) {
        filteredData = searchFilter(selectedCategory, filteredData, ['nom_cat_pro', 'nom_pro'])
      }
      
      // Aplicar filtro de estado
      if (selectedState) {
        filteredData = searchFilter(selectedState, filteredData, ['sta_pro'])
      }

      // Aplicar filtro de búsqueda
      if (searchQuery) {
        filteredData = searchFilter(searchQuery, filteredData, ['nom_pro', 'des_pro', 'nom_cat_pro'])
      }

      setCurrentPage(1)
      setProducts(divideList(filteredData, 12))
    }
  }, [selectedCategory, searchQuery, productsAlmc, selectedState])

  return (
    <main className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1>Administración de Productos</h1>
        <div className={styles.headerActions}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <NavLink 
            className={styles.exportButton}
            to={'/admin/products/register'}
          >
            <Plus size={16} />
            Nuevo Producto
          </NavLink>
        </div>
      </header>

      <aside className={styles.adminContent}>
      {sidebarOpen? (
          <aside className={`${styles.filterPanel} ${sidebarOpen ? styles.open : styles.closed}`}>
            <span className={styles.filterPanelHeader}>
              <h3><Filter size={18} />Filtros</h3>
              <button 
                onClick={toggleSidebar} 
                className={styles.toggleButton}
                aria-label={"Cerrar menú"}
              >
                <ChevronLeft size={20} />
              </button>
            </span>
            
              <article className={styles.filterGroup}>
                <label>Categorías</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">Todas las categorías</option>
                  {categories?.map((category, idx) => (
                    <option key={idx} value={category.nom_cat_pro}>
                      {category.nom_cat_pro}
                    </option>
                  ))}
                </select>
              </article>

              <div className={styles.filterGroup}>
                <label>Estado</label>
                <select
                 className={styles.filterSelect}
                 onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value=''>Todos</option>
                  <option value='DISPONIBLE'>Disponible</option>
                  <option value='NO-DISPONIBLE'>No disponible</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Inventario</label>
                <select 
                  className={styles.filterSelect} 
                  onClick={() => alert('No sirve papi te me calmas!!')}
                  disabled
                >
                  <option>(En mantenimiento)</option>
                </select>
              </div>
          </aside>
        ):(
          <button
            className={styles.toggleFilterPanel}
            onClick={toggleSidebar}
          >
            <Filter size={18} />Filtros
          </button>
        )}

        <main className={styles.productContent}>
          <div className={styles.statsBar}>
            <div className={styles.statCard}>
              <span>Productos totales</span>
              <strong>{stats?.cant_pro_reg || 0}</strong>
            </div>
            <div className={styles.statCard}>
              <span>En oferta</span>
              <strong>{stats?.cant_ofe_cat + stats?.cant_ofe_pro || 0}</strong>
            </div>
            <div className={styles.statCard}>
              <span>Agotados</span>
              <strong>{stats?.pro_solo_out || 0}</strong>
            </div>
          </div>

          <div className={styles.productsTableContainer}>
            {products ? (
              <>
                <table className={styles.productsTable}>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products[currentPage - 1]?.map((product, idx) => (
                      <tr 
                        key={idx} 
                        className={styles.productRow}
                      >
                        <td>
                          <div className={styles.productCell}>
                            {product?.img_default && (
                              <CheckImage
                                src={product.img_default}
                                alt={product.nom_pro}
                                className={styles.productThumbnail}
                                imgDefault={imgDefault}
                              />
                            )}
                            <div>
                              <div className={styles.productName}>{product.nom_pro}</div>
                              <div className={styles.productId}>ID: {product.id_pro}</div>
                            </div>
                          </div>
                        </td>
                        <td>{product.nom_cat_pro}</td>
                        <td>
                          <div className={styles.priceCell}>
                            {product.offers? 
                              `$${formatNumber(Discount(product.pre_pro,product?.offers?.[0]?.por_des_ofe))}`
                              :`$${formatNumber(product.pre_pro)}`
                            }
                            {product.offers && (
                              <span className={styles.saleTag}>
                                -{product?.offers?.[0]?.por_des_ofe || 0}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className={`${styles.stockCell} ${
                            product.stock_total <= 0 ? styles.outOfStock : 
                            product.stock_total < 10 ? styles.lowStock : ''
                          }`}>
                            {product.stock_total}
                          </div>
                        </td>
                        <td>
                          <div className={`${styles.statusBadge} ${
                            product.stock_total <= 0 ? styles.statusInactive :
                            product.onSale ? styles.statusSale :
                            styles.statusActive
                          }`}>
                            {product.stock_total <= 0 ? 'Agotado' : 
                             product.offers ? 'En oferta' : 'Activo'}
                          </div>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button 
                              className={styles.viewButton}
                              onClick={() => {
                                localStorage.setItem('id_pro',product.id_pro)
                                navigate('/admin/products/details')
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className={styles.editButton}
                              onClick={() => {
                                localStorage.setItem('id_pro',product.id_pro)
                                navigate('/admin/products/edit')
                              }}
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.tableFooter}>
                  <div className={styles.resultsInfo}>
                    Mostrando {products[currentPage - 1]?.length} de {productsAlmc?.length} productos
                  </div>
                  <Paginacion
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    data={products}
                  />
                </div>
              </>
            ) : (
              <div className={styles.noResults}>
                <p>No se encontraron productos</p>
                <button className={styles.addProductButton}>
                  + Agregar nuevo producto
                </button>
              </div>
            )}
          </div>
        </main>
      </aside>
      {loading && (
        <AdminLoadingScreen message='Cargando Información de productos' />
      )}
    </main>
  )
}