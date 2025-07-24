// Librarys 
import { useState, useEffect } from "react"
import { Heart, PackagePlus, Eye } from 'lucide-react'
import { useNavigate } from "react-router-dom";

// Imports 
import { useCart } from "../../Contexts/CartContext"
import { CheckImage, formatNumber } from "../../Utils/utils"
import Button from "../Button/Button"
import Badge from "../Badge/Badge"
import ProductQuickView from "../ProductQuickView/ProductQuickView"

// Import styles 
import styles from "./ProductCard.module.css"

// Component 
const ProductCard = ({ data = {}, imgDefault = '', set }) => {
  // Dynamic vars 
  const [ isLiked, setIsLiked ] = useState(null)
  const [ showQuickView, setShowQuickView ] = useState(null)
  const [ showImg, setShowImg ] = useState(null)
  const [ product, setProduct ] = useState(null)

  // Vars 
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleQuickAdd = () => {
    addToCart(product, product?.sizes[0], product?.colors[0])
  }

  const handleLike = () => {
    const newLiked = !isLiked
    setIsLiked(newLiked)
    localStorage.setItem(`liked-product-${product.id_pro}`, newLiked)
  }

  const handleCardClick = () => {
    set(product)
    navigate(`/product/${product.id_pro}`)
  }

  // Persistencia de likes en localStorage
  useEffect(() => {
    if (data) setProduct(data)
    if (product) {
      const liked = localStorage.getItem(`liked-product-${product?.id_pro}`)
      if (liked === "true") setIsLiked(true)
      }
    setShowImg(data?.colors[0]?.url_img || 'url')
  }, [])

  return (
    <>
      { product && (
        <main>
          <section className={styles.card} onClick={handleCardClick} style={{ cursor: "pointer" }}>
            <div className={styles.imageContainer}>
              {showImg && (
                <CheckImage
                  src={showImg}  
                  alt={product.nom_pro}
                  imgDefault={imgDefault}
                  className={styles.image}
                />
              )}
              {/* Badges */}
              <div className={styles.badges}>
                {product.onSale && <Badge variant="sale">Oferta</Badge>}
                {product.featured && <Badge variant="featured">Destacado</Badge>}
              </div>

              {/* Actions overlay */}
              <div className={styles.overlay}>
                <div className={styles.overlayActions}>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuickView(true);
                    }}
                  >
                    <Eye /> Vista Rápida
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={(e) => { e.stopPropagation(); handleQuickAdd() }}
                  >
                    <PackagePlus /> Agregar
                  </Button>
                </div>
              </div>

              {/* Wishlist button */}
              <button
                className={styles.wishlistButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
              >
                <span style={{ color: isLiked ? "#ef4444" : "#6b7280" }}>
                  <Heart />
                </span>
              </button>
            </div>

            <div className={styles.content}>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.nom_pro}</h3>

                <div className={styles.priceContainer}>
                  <span className={styles.price}>${formatNumber(product.pre_pro)}</span>
                  {/* {product.originalPrice && (
                    <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
                  )} */}
                </div>

                <div className={styles.colors}>
                  {product?.colors?.map((color, index) => (
                    <div key={index} className={styles.colorDot} style={{ backgroundColor: color.hex_col }} />
                  ))}
                  {product?.colors?.length > 3 && <span className={styles.colorCount}>+{product?.colors?.length - 3}</span>}
                </div>
              </div>
            </div>
          </section>

          <ProductQuickView
            data={product}
            isOpen={showQuickView}
            onClose={() => setShowQuickView(false)}
            img={imgDefault}
          />
        </main>
        )
      }
    </>
  )
}

export default ProductCard
