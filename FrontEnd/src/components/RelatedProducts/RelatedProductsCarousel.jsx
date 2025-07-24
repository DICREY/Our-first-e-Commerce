import { useEffect, useState, useRef } from "react";
import { PostData } from "../../Utils/Requests";
import ProductCard from "../ProductCard/ProductCard";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from "./RelatedProductsCarousel.module.css";

const RelatedProductsCarousel = ({ URL = '', img = '', categoryId = '' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!categoryId) return;
        
        const response = await PostData(`${URL}/products/by/categorie`, { 
          by: categoryId 
        });
        
        const productsData = response?.result || response || [];
        setProducts(Array.isArray(productsData) ? productsData : [productsData]);
      } catch (err) {
        console.error("Error fetching related products:", err);
        setError("Error al cargar productos relacionados");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [URL, categoryId]);

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
      }
    };

    if (carouselRef.current) {
      carouselRef.current.addEventListener('scroll', handleScroll);
      handleScroll(); // Verificar estado inicial
    }

    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [products]); // Dependencia de products para recalcular cuando cambien

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return <div className={styles.loading}>Cargando productos relacionados...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (products.length === 0) return null;

  return (
    <section className={styles.carouselContainer}>
      <h2 className={styles.title}>Más productos de esta categoría</h2>
      
      <div className={styles.carouselWrapper}>
        {showLeftArrow && (
          <button 
            className={`${styles.arrowButton} ${styles.leftArrow}`}
            onClick={() => scroll('left')}
            aria-label="Desplazar hacia la izquierda"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        <div className={styles.carousel} ref={carouselRef}>
          {products.map((product) => (
            <div key={product.id_pro} className={styles.productWrapper}>
              <ProductCard 
                data={product} 
                imgDefault={img} 
                set={() => {}}
              />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button 
            className={`${styles.arrowButton} ${styles.rightArrow}`}
            onClick={() => scroll('right')}
            aria-label="Desplazar hacia la derecha"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    </section>
  );
};

export default RelatedProductsCarousel;