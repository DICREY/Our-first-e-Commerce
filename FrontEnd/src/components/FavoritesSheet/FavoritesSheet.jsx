// Librarys 
import { useState, useContext, useEffect } from "react";
import { Heart } from 'lucide-react';
import { AuthContext } from "../../Contexts/Contexts";
import Modal from "../Modal/Modal";
import ProductCard from "../Products/ProductCard/ProductCard";

// Import styles 
import styles from "./FavoritesSheet.module.css";

// Component 
const FavoritesSheet = ({ URL = '', isOpen, onClose, img = '' }) => {
  // Dynamic vars 
  const [loading, setLoading] = useState(false)

  // Vars
  let { user } = useContext(AuthContext)
  const favorites = JSON.parse(localStorage.getItem(`favorites_${user?.email}`))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tus Favoritos">
      <section className={styles.container}>
        <header className={styles.header}>
          {favorites?.length > 0 && (
            <span className={styles.countBadge}>
              {favorites?.length} {favorites?.length === 1 ? "producto" : "productos"}
            </span>
          )}
        </header>

        {loading ? (
          <section className={styles.emptyState}>
            <p>Cargando favoritos...</p>
          </section>
        ) : !favorites || favorites.length < 1 ? (
          <section className={styles.emptyState}>
            <div className={styles.emptyIcon}><Heart /></div>
            <h3 className={styles.emptyTitle}>Tu lista de favoritos está vacía</h3>
            <p className={styles.emptyDescription}>
              Guarda tus productos favoritos haciendo clic en el corazón para verlos aquí.
            </p>
          </section>
        ) : (
          <section className={styles.productsGrid}>
            {favorites && favorites?.map((product, index) => (
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