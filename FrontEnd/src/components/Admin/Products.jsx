// Librarys 
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Imports 
import { CheckImage, divideList, errorStatusHandler, formatNumber, searchFilter } from '../../Utils/utils'
import { GetData } from '../../Utils/Requests'

// Import styles 
import styles from '../../styles/Admin/ProductList.module.css'
import { NavAdmin } from '../Navs/NavAdmin'

// Component 
export const ProductList = ({ URL = '', imgDefault = '' }) => {
  // Dynamic vars 
  const [ products, setProducts ] = useState(null)
  const [ productsAlmc, setProductsAlmc ] = useState(null)
  const [ loading, setLoading ] = useState(true)
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ totalProducts, setTotalProducts ] = useState(0)
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
    const filterData = searchFilter(categoryId,productsAlmc,['nom_cat_pro'])
    if (filterData) {
      setCurrentPage(1)
      setProducts(divideList(filterData,12))
    }
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const calculateDiscount = (currentPrice, originalPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  }

  if (loading) {
    return <div className={styles.loading}>Loading products...</div>
  }

  return (
    <main className={styles.productListMainContainer}>
      <NavAdmin />
      <main className={styles.productListContainer}>
        <div className={styles.header}>
          <h1>Products</h1>
          <div className={styles.resultsInfo}>
            Mostrando pagina {currentPage}–{products?.length} de {productsAlmc?.length} Productos
          </div>
        </div>

        <div className={styles.filterSection}>
          <div className={styles.categoryFilter}>
            <label htmlFor="category">Filter by Category:</label>
            <select 
              id="category"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={styles.selectInput}
            >
              <option value="">All Categories</option>
              {categories?.map((category, idx) => (
                <option key={idx + 12} value={category.nom_cat_pro}>
                  {category.nom_cat_pro}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.productsGrid}>
          {products && products[currentPage - 1]?.map((product,idx) => (
            <div key={idx + 192} className={styles.productCard}>
              <div className={styles.productImageContainer}>
                <CheckImage 
                  src={product.image} 
                  alt={product.nom_pro} 
                  className={styles.productImage}
                  imgDefault={imgDefault}
                />
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
                  <div className={styles.rating}>({product.rating})</div>
                  <div className={styles.shipping}>Shipping Cost: ${product.pre_pro}</div>
                  <div className={styles.stock}>{product.stock}</div>
                </div>

                <div className={styles.actionButtons}>
                  <button className={styles.favoriteButton}>
                    <span className={styles.icon}>♥</span> Favourite
                  </button>
                  <button className={styles.addToCartButton}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.pagination}>
          {products?.map((i,idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx + 1)}
              className={`${styles.pageButton} ${currentPage === idx + 1 ? styles.active : ''}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </main>
    </main>
  )
}