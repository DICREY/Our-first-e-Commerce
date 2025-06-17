import { useState, useMemo } from "react";
import { products, categories } from "../data/products";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductCatalog.module.css";

const getAllColors = (products) => {
  const colorSet = new Set();
  products.forEach((p) => p.colors.forEach((c) => colorSet.add(c)));
  return Array.from(colorSet);
};

const getAllSizes = (products) => {
  const sizeSet = new Set();
  products.forEach((p) => p.sizes.forEach((s) => sizeSet.add(s)));
  return Array.from(sizeSet).sort((a, b) => {
    // Ordenar tallas numéricas primero
    if (!isNaN(a)) return !isNaN(b) ? a - b : -1;
    if (!isNaN(b)) return 1;
    return a.localeCompare(b);
  });
};

const ProductCatalog = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sort, setSort] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 200]);

  // Calcula el rango de precios real
  const minPrice = Math.min(...products.map((p) => p.price));
  const maxPrice = Math.max(...products.map((p) => p.price));

  // Filtros y ordenamiento
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "Todos") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    if (selectedColor) {
      filtered = filtered.filter((p) =>
        p.colors.map((c) => c.toLowerCase()).includes(selectedColor.toLowerCase())
      );
    }
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) =>
        selectedSizes.some((size) => p.sizes.includes(size))
      );
    }
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "name-asc") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));

    return filtered;
  }, [selectedCategory, search, selectedColor, selectedSizes, sort, priceRange]);

  const allColors = getAllColors(products);
  const allSizes = getAllSizes(products);

  const handleSizeChange = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  return (
    <div className={styles.catalogPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nuestro Catálogo</h1>
        <p className={styles.subtitle}>Encuentra lo que buscas entre nuestra selección</p>
      </div>

      <div className={styles.filtersBar}>
        <div className={styles.filterSection}>
          <span className={styles.sectionTitle}>Categorías</span>
          <div className={styles.categories}>
            <button
              className={`${styles.categoryBtn} ${selectedCategory === "Todos" ? styles.active : ""}`}
              onClick={() => setSelectedCategory("Todos")}
            >
              Todos
            </button>
            {categories
              .filter((cat) => cat !== "Todos")
              .map((cat) => (
                <button
                  key={cat}
                  className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
          </div>
        </div>

        <div className={styles.filterSection}>
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
                {allColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <div className={styles.priceRange}>
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
        </div>

        <div className={styles.filterSection}>
          <span className={styles.sectionTitle}>Tallas</span>
          <div className={styles.sizeFilter}>
            {allSizes.map((size) => (
              <div key={size}>
                <input
                  type="checkbox"
                  id={`size-${size}`}
                  className={styles.sizeOption}
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                <label htmlFor={`size-${size}`} className={styles.sizeLabel}>
                  {size}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.productsGrid}>
        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <p className={styles.emptyText}>No encontramos productos con esos filtros</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;