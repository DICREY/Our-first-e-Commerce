// Librarys 
import { useState, useContext, useMemo } from "react";
import { Heart } from 'lucide-react';
import { AuthContext } from "../../Contexts/Contexts";
import Modal from "../Modal/Modal";
import ProductCard from "../Products/ProductCard/ProductCard";

// Import styles 
import styles from "./FavoritesSheet.module.css";

// Component 
const FavoritesSheet = ({ URL = '', isOpen, onClose, img = '' }) => {
  // Vars
  let { user } = useContext(AuthContext)
  const rawFavorites = user?.email ? JSON.parse(localStorage.getItem(`favorites_${user?.email}`)) : null
  const favorites = Array.isArray(rawFavorites) ? rawFavorites : (rawFavorites ? [rawFavorites] : [])

  // Función para procesar productos (igual que en ProductCatalog)
  const processProducts = (rawProducts) => {
    const productsArray = Array.isArray(rawProducts) ? rawProducts : (rawProducts ? [rawProducts] : []);
    
    return productsArray.map(product => {
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
        // Si vienen de GetUserFavorites, están como string separadas por comas
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

  // Procesar productos favoritos
  const processedFavorites = useMemo(() => {
    if (!favorites || favorites.length === 0) return [];
    return processProducts(favorites);
  }, [favorites]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tus Favoritos">
      <section className={styles.container}>
        <header className={styles.header}>
          {processedFavorites?.length > 0 && (
            <span className={styles.countBadge}>
              {processedFavorites?.length} {processedFavorites?.length === 1 ? "producto" : "productos"}
            </span>
          )}
        </header>

        {!processedFavorites || processedFavorites.length < 1 ? (
          <section className={styles.emptyState}>
            <div className={styles.emptyIcon}><Heart /></div>
            <h3 className={styles.emptyTitle}>Tu lista de favoritos está vacía</h3>
            <p className={styles.emptyDescription}>
              Guarda tus productos favoritos haciendo clic en el corazón para verlos aquí.
            </p>
          </section>
        ) : (
          <section className={styles.productsGrid}>
            {processedFavorites && processedFavorites?.map((product, index) => (
              <ProductCard
                URL={URL}
                key={index + 129}
                data={product}
                imgDefault={img}
                isFavorite={true}
              />
            ))}
          </section>
        )}
      </section>
    </Modal>
  );
};

export default FavoritesSheet;