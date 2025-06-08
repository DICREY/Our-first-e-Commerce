// Librarys 
import { useEffect, useState } from "react"
import { Heart } from 'lucide-react'

// Imports 
import Modal from "../Modal/Modal"
import ProductCard from "../ProductCard/ProductCard"

import styles from "./FavoritesSheet.module.css"

const getLikedProductIds = () => {
  return Object.keys(localStorage)
    .filter(
      (key) =>
        key.startsWith("liked-product-") && localStorage.getItem(key) === "true"
    )
    .map((key) => key.replace("liked-product-", ""))
}

const FavoritesSheet = ({ products, isOpen, onClose }) => {
  const [likedIds, setLikedIds] = useState([])

  useEffect(() => {
    if (isOpen) {
      setLikedIds(getLikedProductIds())
    }
  }, [isOpen])

  const likedProducts = products.filter((p) => likedIds.includes(p.id))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tus Favoritos">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Tus productos favoritos</h2>
          {likedProducts.length > 0 && (
            <span className={styles.countBadge}>
              {likedProducts.length} {likedProducts.length === 1 ? "producto" : "productos"}
            </span>
          )}
        </div>

        {likedProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><Heart /></div>
            <h3 className={styles.emptyTitle}>Tu lista de favoritos está vacía</h3>
            <p className={styles.emptyDescription}>
              Guarda tus productos favoritos haciendo clic en el corazón para verlos aquí.
            </p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {likedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default FavoritesSheet