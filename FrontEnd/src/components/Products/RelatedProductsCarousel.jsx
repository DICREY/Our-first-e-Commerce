// Librarys 
import { useEffect, useState } from "react";

// Imports 
import { PostData } from "../../Utils/Requests";
import ProductCard from "./ProductCard";

// Import styles 
import styles from "../../styles/Products/RelatedProductsCarousel.module.css";

// Component 
const RelatedProductsCarousel = ({ URL = '', img = '', categoryId = '' }) => {
  // Dynamic vars 
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const productsPerLoad = 10; // Cargar de 10 en 10 para mantener múltiplos de 5

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!categoryId) return;
        
        const response = await PostData(`${URL}/products/by/categorie`, { 
          by: categoryId 
        });
        
        let productsData = response?.result || response || [];
        productsData = Array.isArray(productsData) ? productsData : [productsData];
        
        // Mezclar los productos para orden aleatorio
        const shuffledProducts = [...productsData].sort(() => Math.random() - 0.5);
        setAllProducts(shuffledProducts);
        setDisplayedProducts(shuffledProducts.slice(0, 10)); // Mostrar 10 inicialmente (2 filas de 5)
      } catch (err) {
        console.error("Error fetching related products:", err);
        setError("Error al cargar productos relacionados");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [URL, categoryId]);

  const loadMoreProducts = () => {
    const nextPage = page + 1;
    const newProducts = allProducts.slice(0, nextPage * productsPerLoad);
    setDisplayedProducts(newProducts);
    setPage(nextPage);
  };

  if (loading) return <div className={styles.loading}>Cargando productos relacionados...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (allProducts.length === 0) return null;

  const hasMoreProducts = displayedProducts.length < allProducts.length;

  return (
    <section className={styles.productsContainer}>
      <h2 className={styles.title}>Más productos de esta categoría</h2>
      
      <div className={styles.productsGrid}>
        {displayedProducts.map((product) => (
          <div key={product.id_pro} className={styles.productWrapper}>
            <ProductCard 
              data={product} 
              imgDefault={img} 
              set={() => {}}
            />
          </div>
        ))}
      </div>

      {hasMoreProducts && (
        <div className={styles.loadMoreContainer}>
          <button 
            className={styles.loadMoreButton}
            onClick={loadMoreProducts}
          >
            Ver más productos ({allProducts.length - displayedProducts.length} disponibles)
          </button>
        </div>
      )}
    </section>
  );
};

export default RelatedProductsCarousel;