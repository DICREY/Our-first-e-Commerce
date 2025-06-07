"use client"

import { useState, useEffect } from "react"
import { useCart } from "../../Contexts/CartContext"
import Button from "../Button/Button"
import Badge from "../Badge/Badge"
import ProductQuickView from "../ProductQuickView/ProductQuickView"
import styles from "./ProductCard.module.css"

const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const { addToCart } = useCart()

  const handleQuickAdd = () => {
    addToCart(product, product.sizes[0], product.colors[0])
  }

  const getColorStyle = (color) => {
    const colorMap = {
      negro: "#000000",
      blanco: "#ffffff",
      rosa: "#f472b6",
      azul: "#3b82f6",
      beige: "#f5f5dc",
      gris: "#6b7280",
      "rosa claro": "#fce7f3",
      "azul marino": "#1e3a8a",
      "azul claro": "#93c5fd",
      "azul oscuro": "#1e40af",
    }
    return colorMap[color.toLowerCase()] || "#a8c5ff"
  }

  // Persistencia de likes en localStorage
  useEffect(() => {
    const liked = localStorage.getItem(`liked-product-${product.id}`)
    if (liked === "true") setIsLiked(true)
  }, [product.id])

  const handleLike = () => {
    const newLiked = !isLiked
    setIsLiked(newLiked)
    localStorage.setItem(`liked-product-${product.id}`, newLiked)
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img
            src={product.image || "/placeholder.svg?height=400&width=300"}
            alt={product.name}
            className={styles.image}
          />

          {/* Badges */}
          <div className={styles.badges}>
            {product.onSale && <Badge variant="sale">Oferta</Badge>}
            {product.featured && <Badge variant="featured">Destacado</Badge>}
          </div>

          {/* Actions overlay */}
          <div className={styles.overlay}>
            <div className={styles.overlayActions}>
              <Button size="sm" variant="secondary" onClick={() => setShowQuickView(true)}>
                Vista Rápida
              </Button>
              <Button size="sm" variant="primary" onClick={handleQuickAdd}>
                🛍️ Agregar
              </Button>
            </div>
          </div>

          {/* Wishlist button */}
          <button className={styles.wishlistButton} onClick={handleLike}>
            <span style={{ color: isLiked ? "#ef4444" : "#6b7280" }}>{isLiked ? "❤️" : "🤍"}</span>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.productInfo}>
            <h3 className={styles.productName}>{product.name}</h3>

            <div className={styles.priceContainer}>
              <span className={styles.price}>${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <div className={styles.colors}>
              {product.colors.slice(0, 3).map((color, index) => (
                <div key={index} className={styles.colorDot} style={{ backgroundColor: getColorStyle(color) }} />
              ))}
              {product.colors.length > 3 && <span className={styles.colorCount}>+{product.colors.length - 3}</span>}
            </div>
          </div>
        </div>
      </div>

      <ProductQuickView product={product} isOpen={showQuickView} onClose={() => setShowQuickView(false)} />
    </>
  )
}

export default ProductCard
