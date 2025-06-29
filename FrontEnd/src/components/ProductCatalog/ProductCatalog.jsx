// Librarys 
import { useState, useMemo, useEffect } from "react"

// Imports 
import ProductCard from "../ProductCard/ProductCard"
import { errorStatusHandler } from "../../Utils/utils"
import { GetData } from "../../Utils/Requests"

// Import styles 
import styles from "./ProductCatalog.module.css"

// Component 
const ProductCatalog = ({ URL = '', imgDefault = '', preSelectedCat = 'Todos', setProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [search, setSearch] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [ categories, setCategories ] = useState()
  const [ products, setProducts ] = useState()
  const [ colors, setColors ] = useState()
  const [ sizes, setSizes ] = useState()
  const [selectedSizes, setSelectedSizes] = useState([])
  const [sort, setSort] = useState("default")
  const [priceRange, setPriceRange] = useState([0, 200])

  // Calcula el rango de precios real
  const minPrice = products && Math.min(...products.map((p) => p.pre_pro))
  const maxPrice = products && Math.max(...products.map((p) => p.pre_pro))

  // Filtros y ordenamiento
  const filteredProducts = useMemo(() => {
    let filtered = products? products: []

    if (selectedCategory !== "Todos") {
      filtered = filtered?.filter((p) => p.nom_cat_pro === selectedCategory)
    }
    if (search.trim()) {
      filtered = filtered?.filter((p) =>
        p.nom_pro.toLowerCase().includes(search.trim().toLowerCase())
      )
    }
    if (selectedColor) {
      filtered = filtered?.filter((p) =>
        p.colors?.map((c) => c.nom_col.toLowerCase()).includes(selectedColor.toLowerCase())
      )
    }
    if (selectedSizes.length > 0) {
      filtered = filtered?.filter((p) =>
        selectedSizes.some((size) => p.sizes?.includes(size))
      )
    }
    filtered = filtered?.filter(
      (p) => p.pre_pro >= priceRange[0] && p.pre_pro <= priceRange[1]
    )

    if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.pre_pro - b.pre_pro)
    if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.pre_pro - a.pre_pro)
    if (sort === "name-asc") filtered = [...filtered].sort((a, b) => a.nom_pro.localeCompare(b.nom_pro))
    if (sort === "name-desc") filtered = [...filtered].sort((a, b) => b.nom_pro.localeCompare(a.nom_pro))

    return filtered
  }, [selectedCategory, search, selectedColor, selectedSizes, sort, priceRange])

  const handleSizeChange = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const getProductCategories = async () => {
    try {
      const cat = await GetData(`${URL}/products/categories`)
      if (cat) {
        setCategories(cat)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      console.log(message)
    }
  }
  const getProductColors = async () => {
    try {
      const data = await GetData(`${URL}/products/colors`)
      if (data) {
        setColors(data)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      console.log(message)
    }
  }

  const getProductSizes = async () => {
    try {
      const data = await GetData(`${URL}/products/sizes`)
      if (data) {
        setSizes(data)
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
        setProducts(prods)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      console.log(message)
    }
  }

  useEffect(() => {
    getProductCategories()
    getProductColors()
    getProductSizes()
    getProducts()
    if (preSelectedCat) setSelectedCategory(preSelectedCat)
  },[])

  return (
    <main className={styles.catalogPage}>
      <header className={styles.header}>
        <h1 className={styles.title}>Nuestro Catálogo</h1>
        <p className={styles.subtitle}>Encuentra lo que buscas entre nuestra selección</p>
      </header>

      <section className={styles.filtersBar}>
        <nav className={styles.filterSection}>
          <span className={styles.sectionTitle}>Categorías</span>
          <address className={styles.categories}>
            <button
              className={`${styles.categoryBtn} ${selectedCategory === "Todos" ? styles.active : ""}`}
              onClick={() => setSelectedCategory("Todos")}
            >
              Todos
            </button>
            {categories?.map((cat, index) => (
                <button
                  key={index + 89}
                  className={`${styles.categoryBtn} ${selectedCategory === cat.nom_cat_pro ? styles.active : ""}`}
                  onClick={() => setSelectedCategory(cat.nom_cat_pro)}
                >
                  {cat.nom_cat_pro}
                </button>
              ))}
          </address>
        </nav>

        <section className={styles.filterSection}>
          <span className={styles.sectionTitle}>Filtrar productos</span>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <select
                className={styles.select}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="default">Ordenar por</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre: A-Z</option>
                <option value="name-desc">Nombre: Z-A</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <select
                className={styles.select}
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <option value="">Todos los colores</option>
                {colors?.map((color, index) => (
                  <option key={index + 8} value={color.nom_col}>
                    {color.nom_col}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <div className={styles.priceproRange}>
                <div className={styles.priceLabels}>
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className={styles.rangeSlider}
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className={styles.rangeSlider}
                />
              </div>
            </div>
          </div>
        </section>

        <div className={styles.filterSection}>
          <span className={styles.sectionTitle}>Tallas</span>
          <div className={styles.sizeFilter}>
            {sizes?.map((size, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={`size-${size.nom_tal_pro}`}
                  className={styles.sizeOption}
                  checked={selectedSizes.includes(size.nom_tal_pro)}
                  onChange={() => handleSizeChange(size.nom_tal_pro)}
                />
                <label htmlFor={`size-${size.nom_tal_pro}`} className={styles.sizeLabel}>
                  {size.nom_tal_pro}
                </label>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.productsGrid}>
        {filteredProducts?.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <p className={styles.emptyText}>No encontramos productos con esos filtros</p>
          </div>
        ) : (
          filteredProducts?.map((product) => (
            <ProductCard 
              key={product.id_pro} 
              product={product} 
              imgDefault={imgDefault} 
              setProduct={setProduct}
            />
          ))
        )}
      </div>
    </main>
  )
}

export default ProductCatalog