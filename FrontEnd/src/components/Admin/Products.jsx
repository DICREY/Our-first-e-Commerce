// Librarys 
import React, { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'

// Imports 
import { CheckImage, divideList, errorStatusHandler, formatNumber, searchFilter } from '../../Utils/utils'
import { GetData } from '../../Utils/Requests'
import { Paginacion } from '../Global/Paginacion'

// Import styles 
import styles from '../../styles/Admin/ProductList.module.css'

// Component 
export const ProductList = ({ URL = '', imgDefault = '' }) => {
  // Dynamic vars 
  const [ products, setProducts ] = useState(null)
  const [ productsAlmc, setProductsAlmc ] = useState(null)
  const [ loading, setLoading ] = useState(true)
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ selectedCategory, setSelectedCategory ] = useState('')
  const [ categories, setCategories ] = useState([])

  // Functions 
  const getProductCategories = async () => {
    try {
      const product = await GetData(`${URL}/products/categories`)
      if (product) {
        setCategories(product)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      console.log(message)
    }
  }
  
  const getProducts = async () => {
    try {
      const prods = await GetData(`${URL}/products/all`)
      if (prods) {
        setProducts(divideList(prods,12))
        setProductsAlmc(prods)
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)
      const message = errorStatusHandler(err)
      console.log(message)
    }
  }

  useEffect(() => {
    getProductCategories()
    getProducts()
  }, [])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    const filterData = searchFilter(categoryId,productsAlmc,['nom_cat_pro','nom_pro'])
    if (filterData) {
      setCurrentPage(1)
      setProducts(divideList(filterData,12))
    }
  }

  const calculateDiscount = (currentPrice, originalPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  }

  if (loading) {
    return <div className={styles.loading}>Loading products...</div>
  }

  return (
    <main className={styles.mainContent}>
      <header className={styles.header}>
        <h1>Products</h1>
        <div className={styles.resultsInfo}>
          Mostrando pagina {currentPage}–{products?.length} de {productsAlmc?.length} Productos
        </div>
      </header>

      <nav className={styles.filterSection}>
        <div className={styles.categoryFilter}>
          <label htmlFor="category">Buscar por nombre, categoria:</label>
          <input
            id="category"
            list='categoryProFilter'
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={styles.selectInput}
          />
          <datalist id='categoryProFilter'>
            <option value="">All Categories</option>
            {categories?.map((category, idx) => (
              <option key={idx + 12} value={category.nom_cat_pro}>
                {category.nom_cat_pro}
              </option>
            ))}
          </datalist>
        </div>
      </nav>

      <section className={styles.productsGrid}>
        {products ?
          products[currentPage - 1]?.map((product, idx) => (
            <div key={idx + 192} className={styles.productCard}>
              <div className={styles.productImageContainer}>
                {product?.colors[0]?.url_img && (
                  <CheckImage
                    src={product?.colors[0]?.url_img}
                    alt={product.nom_pro}
                    className={styles.productImage}
                    imgDefault={imgDefault}
                  />
                )}
                {product.onSale && (
                  <div className={styles.saleBadge}>
                    -{calculateDiscount(product.pre_pro, product.pre_pro)}%
                  </div>
                )}
              </div>

              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{product.nom_pro}</h3>
                <div className={styles.productCategory}>{product.nom_cat_pro}</div>

                {/* <ul className={styles.featuresList}>
                  {product.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>• {feature}</li>
                  ))}
                </ul> */}

                <div className={styles.priceContainer}>
                  <span className={styles.currentPrice}>${formatNumber(product.pre_pro)}</span>
                  {product.onSale && (
                    <>
                      <span className={styles.originalPrice}>${formatNumber(product.pre_pro)}</span>
                      <span className={styles.discount}>
                        -{calculateDiscount(product.pre_pro, product.pre_pro)}%
                      </span>
                    </>
                  )}
                </div>

                <div className={styles.additionalInfo}>
                  {/* <div className={styles.rating}>({idx + 1})</div> */}
                  <div className={styles.shipping}>Shipping Cost: ${formatNumber(product.pre_pro)}</div>
                  <div className={styles.stock}>{product.stock}</div>
                </div>

                <div className={styles.actionButtons}>
                  <button className={styles.favoriteButton}>
                    <Eye className={styles.icon}></Eye> Ver
                  </button>
                  <button className={styles.addToCartButton}>
                    Editar
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className={styles.noResults}>
              No se encontraron productos registrados en el sistema
            </div>
          )}
      </section>

      <Paginacion
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        data={products}
      />
    </main>
  )
}