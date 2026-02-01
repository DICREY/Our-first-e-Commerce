// Librarys 
import { useEffect, useState } from "react";

// Imports 
import { PostData } from "../../../Utils/Requests";
import { showAlert, errorStatusHandler } from "../../../Utils/utils";
import ProductCard from "../ProductCard/ProductCard";

// Import styles 
import styles from "./RelatedProductsCarousel.module.css";

// Component 
const RelatedProductsCarousel = ({ URL = '', img = '', categoryId = '', setProduct }) => {
  // Dynamic vars 
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)

  // Función para procesar productos (igual que en ProductCatalog)
  const processProducts = (rawProducts) => {
    if (!rawProducts) return [];
    const productsArray = Array.isArray(rawProducts) ? rawProducts : [rawProducts];
    
    return productsArray.filter(product => product && product.id_pro).map(product => {
      const mainImage = product.url_img && product.url_img.trim() !== ''
        ? product.url_img
        : (product.imagen_default || '');

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

      // Procesar tallas - puede venir de múltiples fuentes
      let sizes = [];
      if (Array.isArray(product.sizes)) {
        sizes = product.sizes;
      } else if (product.tallas_disponibles && typeof product.tallas_disponibles === 'string') {
        // Si vienen de endpoints como /by/categorie, están como string separadas por comas
        sizes = product.tallas_disponibles.split(',').map(t => ({ nom_tal_pro: t.trim() }));
      }

      return {
        ...product,
        url_img: mainImage,
        colors: productColors,
        sizes: sizes,
        inv: Array.isArray(product.inv) ? product.inv : (product.inventario || [])
      };
    });
  };

  // Vars 
  const productsPerLoad = 10

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
        
        // Procesar los productos para asegurar que tengan la estructura correcta
        const processedProducts = processProducts(productsData);
        
        // Mezclar los productos para orden aleatorio
        const shuffledProducts = [...processedProducts].sort(() => Math.random() - 0.5);
        setAllProducts(shuffledProducts);
        setDisplayedProducts(shuffledProducts.slice(0, 10)); // Mostrar 10 inicialmente (2 filas de 5)
      } catch (err) {
        const message = errorStatusHandler(err)
        showAlert('Error', message, 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [URL, categoryId])

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
        {displayedProducts?.map((product) => (
          <div key={product.id_pro} className={styles.productWrapper}>
            <ProductCard 
              data={product} 
              imgDefault={img} 
              set={setProduct}
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