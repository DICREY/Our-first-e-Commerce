// Librarys 
import { useState, useEffect, useMemo, useCallback, useContext } from "react"
import { Heart, PackagePlus, Eye } from 'lucide-react'
import { useNavigate } from "react-router-dom"

// Imports
import { useCart } from "../../Contexts/CartContext"
import { CheckImage, formatNumber, showAlert, Discount, errorStatusHandler} from "../../Utils/utils"
import { AuthContext } from "../../Contexts/Contexts"
import Button from "../Button/Button"
import Badge from "../Badge/Badge"
import ProductQuickView from "./ProductQuickView"

// Import styles 
import styles from "../../styles/Products/ProductCard.module.css"

// Component 
const ProductCard = ({ URL = '', data = {}, imgDefault = '', set, isFavorite = null }) => {
  // Contexts and hooks
  const { addToCart: addToCartContext } = useCart()
  const { user, toggleFavorite } = useContext(AuthContext)
  const navigate = useNavigate()

  // Obtén el token desde el contexto o localStorage
  const token = useContext(AuthContext)?.token || localStorage.getItem('token')

  // State
  const [showQuickView, setShowQuickView] = useState(false)
  const [showImg, setShowImg] = useState(imgDefault)
  const [imgError, setImgError] = useState(false)
  const [isLiked, setIsLiked] = useState(isFavorite)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)

  // Normalize product data
  const product = useMemo(() => {
    if (!data) return null

    // Handle product images
    let productImage = ''
    if (data.url_img?.trim()) {
      productImage = data.url_img
    }

    // Process colors
    let productColors = [];
    if (data.colors) {
      if (typeof data.colors === 'string') {
        productColors = data.colors.split('---').map(colorStr => {
          const [nom_col, hex_col, nom_img, url_img] = colorStr.split(';')
          return {
            nom_col: nom_col || '',
            hex_col: hex_col || '#ccc',
            nom_img: nom_img || '',
            url_img: url_img || ''
          }
        })
      } else if (Array.isArray(data.colors)) {
        productColors = data.colors.map(color => ({
          nom_col: color.nom_col || '',
          hex_col: color.hex_col || '#ccc',
          nom_img: color.nom_img || '',
          url_img: color.url_img || ''
        }))
      }
    }

    return {
      id_pro: data.id_pro || '',
      nom_pro: data.nom_pro || '',
      pre_pro: data.pre_pro || 0,
      url_img: productImage,
      colors: productColors,
      sizes: Array.isArray(data.sizes) ? data.sizes : [],
      onSale: Boolean(data.onSale),
      featured: Boolean(data.featured),
      ...data
    };
  }, [data])

  // Set initial image and check if product is liked
  useEffect(() => {
    if (!product) return

    let imageToShow = imgDefault

    // First check product main image
    if (product.url_img) {
      imageToShow = product.url_img
    }
    // Then check colors for images
    else if (Array.isArray(product.colors)) {
      const colorWithImage = product.colors.find(
        color => color.url_img?.trim()
      );
      if (colorWithImage) {
        imageToShow = colorWithImage.url_img
      }
    }

    setShowImg(imageToShow)
    setImgError(false)

    // Check if product is in favorites
    if (user?.email && product?.id_pro) {
      // checkIfProductIsLiked();
    }
  }, [product, imgDefault, user])

  // Handle add to favorites (backend integration)
  const handleLike = useCallback(async (e) => {
    e?.stopPropagation();

    setIsTogglingFavorite(true);
    try {
      await toggleFavorite(product.id_pro)
      setIsLiked(!isLiked)
    } catch (error) {
      const message = errorStatusHandler(error)
      showAlert("Error", message, "error")
    } finally {
      setIsTogglingFavorite(false)
    }
  }, [isLiked, user, product, navigate, URL, token])

  const handleQuickAddClick = (e) => {
    e.stopPropagation();
    setShowQuickView(true);
  };


  const handleCardClick = useCallback(() => {
    if (set && product?.id_pro) {
      set(product);
      navigate(`/product/${product.id_pro}`);
    }
  }, [product, set, navigate])

  const handleImageError = useCallback(() => {
    setImgError(true);
    setShowImg(imgDefault);
  }, [imgDefault])

  if (!product?.id_pro) return null;

  const displayColors = Array.isArray(product.colors) ? product.colors : [];
  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <CheckImage
          src={imgError ? imgDefault : showImg}
          alt={product.nom_pro || 'Product image'}
          imgDefault={imgDefault}
          className={styles.image}
          onError={handleImageError}
          loading="lazy"
        />

        {/* Badges */}
        <div className={styles.badges}>
          {product?.offers && <Badge variant="sale">-{product.offers?.[0].por_des_ofe}%</Badge>}
          {product.featured && <Badge variant="featured">Destacado</Badge>}
        </div>

        {/* Acciones */}
        <div className={styles.overlay}>
          <div className={styles.overlayActions}>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickView(true);
              }}
              disabled={isAddingToCart || isTogglingFavorite}
            >
              <Eye /> Vista Rápida
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleQuickAddClick}
              disabled={isAddingToCart || isTogglingFavorite}
            >
              <PackagePlus /> Añadir
            </Button>
          </div>
        </div>

        {/* Botón de favoritos */}
        <button
          className={styles.wishlistButton}
          onClick={handleLike}
          disabled={isAddingToCart || isTogglingFavorite}
          aria-label={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart
            fill={isLiked ? "#ef4444" : "none"}
            color={isLiked ? "#ef4444" : "#6b7280"}
            className={isTogglingFavorite ? styles.pulseAnimation : ''}
          />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.nom_pro}</h3>

          <div className={styles.priceContainer}>
            {product?.offers? (
              <>
                <span className={styles.price}>
                  ${formatNumber(Discount(product.pre_pro, product.offers?.[0]?.por_des_ofe))}
                </span>
                <span className={styles.originalPrice}>
                  ${formatNumber(product.pre_pro)}
                </span>
              </>
            ):(
              <span className={styles.price}>
                ${formatNumber(product.pre_pro)}
              </span>
            )}
          </div>

          {displayColors.length > 0 && (
            <div className={styles.colors}>
              {displayColors.slice(0, 3).map((color, index) => (
                <div
                  key={`color-${product.id_pro}-${index}`}
                  className={styles.colorDot}
                  style={{ backgroundColor: color.hex_col || '#ccc' }}
                  title={color.nom_col}
                />
              ))}
              {displayColors.length > 3 && (
                <span className={styles.colorCount}>
                  +{displayColors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <ProductQuickView
        URL={URL}
        data={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        img={imgDefault}
      />
    </div>
  );
};

export default ProductCard;
