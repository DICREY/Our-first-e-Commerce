// Librarys 
import { useState, useMemo, useEffect } from "react"

// Imports 
import { errorStatusHandler, showAlert } from "../../Utils/utils"
import { GetData } from "../../Utils/Requests"
import ProductCard from "./ProductCard/ProductCard"

// Import styles 
import styles from "../../styles/Products/ProductCatalog.module.css"

// Component 
const ProductCatalog = ({ URL = '', imgDefault = '', preSelectedCat = 'Todos', setProduct }) => {
  // Dynamic vars 
  const [selectedCategory, setSelectedCategory] = useState(preSelectedCat || "Todos")
  const [search, setSearch] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [sort, setSort] = useState("default")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [isLoading, setIsLoading] = useState(true)

  // Función para procesar los productos del backend
  // En ProductCatalog.js, modificar la función processProducts:
  const processProducts = (rawProducts) => {
    // Filtra solo productos disponibles primero
    const availableProducts = rawProducts.filter(product =>
      product.sta_pro === 'DISPONIBLE'
    );

    // Luego procesa los productos disponibles
    return availableProducts.map(product => {
      const mainImage = product.url_img && product.url_img.trim() !== ''
        ? product.url_img
        : '';

      let productColors = [];
      if (product.colors) {
        if (typeof product.colors === 'string') {
          productColors = product.colors.split('---').map(colorStr => {
            const parts = colorStr.split(';');
            return {
              nom_col: parts[0] || '',
              hex_col: parts[1] || '#ccc',
              nom_img: parts[2] || '',
              url_img: parts[3] || ''
            };
          });
        } else if (Array.isArray(product.colors)) {
          productColors = product.colors.map(color => ({
            nom_col: color.nom_col || '',
            hex_col: color.hex_col || '#ccc',
            nom_img: color.nom_img || '',
            url_img: color.url_img || ''
          }));
        }
      }

      return {
        ...product,
        url_img: mainImage,
        colors: productColors,
        sizes: Array.isArray(product.sizes) ? product.sizes : []
      };
    });
  };
  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [
          catData,
          colorsData,
          sizesData,
          prodsData
        ] = await Promise.all([
          GetData(`${URL}/products/categories`),
          GetData(`${URL}/products/colors`),
          GetData(`${URL}/products/sizes`),
          GetData(`${URL}/products/all`)
        ]);

        if (catData) setCategories(catData);
        if (colorsData) setColors(colorsData);
        if (sizesData) setSizes(sizesData);
        if (prodsData) setProducts(processProducts(prodsData));
      } catch (err) {
        const message = errorStatusHandler(err);
        showAlert('Error', message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [URL]);

  // Calcular rango de precios
  const minPrice = useMemo(() => {
    return products.length > 0 ? Math.min(...products.map(p => p.pre_pro)) : 0
  }, [products])

  const maxPrice = useMemo(() => {
    return products.length > 0 ? Math.max(...products.map(p => p.pre_pro)) : 200
  }, [products])

  // Filtros y ordenamiento
  const filteredProducts = useMemo(() => {
    if (isLoading) return [];

    // Los productos ya están filtrados por disponibilidad en processProducts
    // Solo aplicamos los demás filtros
    let filtered = [...products];

    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(p =>
        p.nom_cat_pro?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.nom_pro.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedColor) {
      filtered = filtered.filter(p =>
        p.colors?.some(c => c.nom_col.toLowerCase() === selectedColor.toLowerCase())
      );
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p =>
        selectedSizes.some(size => p.sizes?.includes(size))
      );
    }

    filtered = filtered.filter(p =>
      p.pre_pro >= priceRange[0] && p.pre_pro <= priceRange[1]
    );

    // Ordenamiento (mantén tu lógica actual)
    switch (sort) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.pre_pro - b.pre_pro);
      case "price-desc":
        return [...filtered].sort((a, b) => b.pre_pro - a.pre_pro);
      case "name-asc":
        return [...filtered].sort((a, b) => a.nom_pro.localeCompare(b.nom_pro));
      case "name-desc":
        return [...filtered].sort((a, b) => b.nom_pro.localeCompare(a.nom_pro));
      default:
        return filtered;
    }
  }, [products, selectedCategory, search, selectedColor, selectedSizes, sort, priceRange, isLoading]);
  const handleSizeChange = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  useEffect(() => {
    if (products.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
    // eslint-disable-next-line
  }, [minPrice, maxPrice, products.length]);



  return (
    <main className={styles.catalogPage}>

      <div className={styles.contentWrapper}>
        {/* Filters sidebar - moved to left side */}
        <aside className={styles.filtersSidebar}>
          <div className={styles.filtersContent}>
            <section className={styles.filterSection}>
              <span className={styles.sectionTitle}>Categorías</span>
              <div className={styles.categories}>
                <button
                  className={`${styles.categoryBtn} ${selectedCategory === "Todos" ? styles.active : ""}`}
                  onClick={() => setSelectedCategory("Todos")}
                >
                  Todos
                </button>
                {categories.map((cat, index) => (
                  <button
                    key={`cat-${index}`}
                    className={`${styles.categoryBtn} ${selectedCategory === cat.nom_cat_pro ? styles.active : ""
                      }`}
                    onClick={() => setSelectedCategory(cat.nom_cat_pro)}
                  >
                    {cat.nom_cat_pro}
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.filterSection}>
              <span className={styles.sectionTitle}>Filtrar por precio</span>
              <div className={styles.priceRange}>
                <div className={styles.priceLabels}>
                  <span>${priceRange[0].toFixed(2)}</span>
                  <span>${priceRange[1].toFixed(2)}</span>
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
            </section>

            <section className={styles.filterSection}>
              <span className={styles.sectionTitle}>Filtrar por color</span>
              <select
                className={styles.select}
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <option value="">Todos los colores</option>
                {colors.map((color, index) => (
                  <option key={`color-${index}`} value={color.nom_col}>
                    {color.nom_col}
                  </option>
                ))}
              </select>
            </section>

            <section className={styles.filterSection}>
              <span className={styles.sectionTitle}>Filtrar por tallas</span>
              <div className={styles.sizeFilter}>
                {sizes.map((size, index) => (
                  <div key={`size-${index}`}>
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
            </section>
          </div>
        </aside>

        {/* Main content area */}
        <div className={styles.mainContent}>
          {/* Search and sort bar */}
          <div className={styles.searchSortBar}>
            <div className={styles.searchGroup}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className={styles.sortGroup}>
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
          </div>

          {/* Products grid */}
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p>Cargando productos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <p className={styles.emptyText}>No encontramos productos con esos filtros</p>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <ProductCard
                  URL={URL}
                  key={product.id_pro}
                  data={product}
                  imgDefault={imgDefault}
                  set={setProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ProductCatalog
