import { useEffect, useState, useContext } from "react";
import { Heart } from 'lucide-react';
import { AuthContext } from "../../Contexts/Contexts";
import Modal from "../Modal/Modal";
import ProductCard from "../Products/ProductCard";
import { GetData, PostData, DeleteData } from "../../Utils/Requests";
import styles from "./FavoritesSheet.module.css";

const FavoritesSheet = ({ URL = '', isOpen, onClose, img = '' }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await PostData(`${URL}/products/favorites/by`, {
        doc_per: user?.doc
      });
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  // Agregar/eliminar favorito
  const toggleFavorite = async (productId, isCurrentlyFavorite) => {
    try {
      if (isCurrentlyFavorite) {
        await PostData(`${URL}/products/favorites/remove`, {
          doc_per: user?.doc,
          productId
        });
      } else {
        await PostData(`${URL}/products/favorites/add`, {
          doc_per: user?.doc,
          productId
        });
      }
      fetchFavorites(); // Refrescar lista
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFavorites();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tus Favoritos">
      <div className={styles.container}>
        <div className={styles.header}>
          {favorites?.length > 0 && (
            <span className={styles.countBadge}>
              {favorites?.length} {favorites?.length === 1 ? "producto" : "productos"}
            </span>
          )}
        </div>

        {loading ? (
          <div className={styles.emptyState}>
            <p>Cargando favoritos...</p>
          </div>
        ) : favorites?.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><Heart /></div>
            <h3 className={styles.emptyTitle}>Tu lista de favoritos está vacía</h3>
            <p className={styles.emptyDescription}>
              Guarda tus productos favoritos haciendo clic en el corazón para verlos aquí.
            </p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {favorites?.map((product, index) => (
              <ProductCard
                key={index + 129}
                data={product}
                imgDefault={img}
                onToggleFavorite={() => toggleFavorite(product.id_pro, true)}
                isFavorite={true}
              />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FavoritesSheet;