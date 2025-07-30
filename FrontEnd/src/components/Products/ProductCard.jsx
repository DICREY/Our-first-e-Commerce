// Librarys 
import { useState, useEffect } from "react"
import { Heart, PackagePlus, Eye } from 'lucide-react'
import { useNavigate } from "react-router-dom"

// Imports
import { useCart } from "../../Contexts/CartContext"
import { CheckImage, formatNumber } from "../../Utils/utils"
import Button from "../Button/Button"
import Badge from "../Badge/Badge"
import ProductQuickView from "./ProductQuickView"

// Import styles 
import styles from "../../styles/Products/ProductCard.module.css"

// Component 
const ProductCard = ({ data = {}, imgDefault = '', set }) => {
  // Dynamic vars 
  const [isLiked, setIsLiked] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const [showImg, setShowImg] = useState(imgDefault)
  const [product, setProduct] = useState({
    id_pro: '',
    nom_pro: '',
    pre_pro: 0,
    colors: [],
    sizes: [],
    onSale: false,
    featured: false,
    ...data
  })

  const { addToCart } = useCart()
  const navigate = useNavigate()

  // Normalizar los datos del producto
  const normalizeProductData = (productData) => {
    if (!productData) return null;

    // Manejar imágenes del producto
    let productImage = '';
    if (productData.url_img && productData.url_img.trim() !== '') {
      productImage = productData.url_img;
    }

    // Procesar colores
    let productColors = [];
    if (productData.colors) {
      if (typeof productData.colors === 'string') {
        productColors = productData.colors.split('---').map(colorStr => {
          const [nom_col, hex_col, nom_img, url_img] = colorStr.split(';');
          return {
            nom_col: nom_col || '',
            hex_col: hex_col || '#ccc',
            nom_img: nom_img || '',
            url_img: url_img || ''
          };
        });
      } else if (Array.isArray(productData.colors)) {
        productColors = productData.colors.map(color => ({
          nom_col: color.nom_col || '',
          hex_col: color.hex_col || '#ccc',
          nom_img: color.nom_img || '',
          url_img: color.url_img || ''
        }));
      }
    }

    return {
      id_pro: productData.id_pro || '',
      nom_pro: productData.nom_pro || '',
      pre_pro: productData.pre_pro || 0,
      url_img: productImage,
      colors: productColors,
      sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
      onSale: Boolean(productData.onSale),
      featured: Boolean(productData.featured),
      ...productData
    };
  };

  useEffect(() => {
    const normalizedProduct = normalizeProductData(data);
    if (normalizedProduct) {
      setProduct(normalizedProduct);

      // Buscar la primera imagen disponible (ya sea en el producto o en sus colores)
      let imageToShow = imgDefault;

      // Primero verificar si el producto tiene imagen directa
      if (normalizedProduct.url_img) {
        imageToShow = normalizedProduct.url_img;
      }
      // Si no, buscar en los colores
      else if (Array.isArray(normalizedProduct.colors)) {
        const colorWithImage = normalizedProduct.colors.find(
          color => color.url_img && color.url_img.trim() !== ''
        );
        if (colorWithImage) {
          imageToShow = colorWithImage.url_img;
        }
      }

      setShowImg(imageToShow);

      // Verificar favoritos
      if (normalizedProduct.id_pro) {
        const liked = localStorage.getItem(`liked-product-${normalizedProduct.id_pro}`) === "true";
        setIsLiked(liked);
      }
    }
  }, [data, imgDefault]);

  // Manejar agregar al carrito
  const handleQuickAdd = (e) => {
    e?.stopPropagation()
    const defaultSize = product?.sizes?.[0] || ''
    const defaultColor = product?.colors?.[0]?.nom_col || ''
    addToCart(product, defaultSize, defaultColor)
  }

  // Manejar favoritos
  const handleLike = (e) => {
    e?.stopPropagation()
    const newLiked = !isLiked
    setIsLiked(newLiked)
    if (product?.id_pro) {
      localStorage.setItem(`liked-product-${product.id_pro}`, newLiked)
    }
  }

  // Manejar clic en la tarjeta
  const handleCardClick = () => {
    if (set && product?.id_pro) {
      set(product)
      navigate(`/product/${product.id_pro}`)
    }
  }

  // No renderizar si no hay datos válidos
  if (!product?.id_pro) return null

  // Obtener colores para mostrar (asegurando que sea un array)
  const displayColors = Array.isArray(product.colors) ? product.colors : []


  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <CheckImage
          src={showImg}
          alt={product.nom_pro || 'Product image'}
          imgDefault={imgDefault}
          className={styles.image}
        />

        {/* Badges */}
        <div className={styles.badges}>
          {product.onSale && <Badge variant="sale">Oferta</Badge>}
          {product.featured && <Badge variant="featured">Destacado</Badge>}
        </div>

        {/* Acciones */}
        <div className={styles.overlay}>
          <div className={styles.overlayActions}>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                setShowQuickView(true)
              }}
            >
              <Eye /> Vista Rápida
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleQuickAdd}
            >
              <PackagePlus /> Agregar
            </Button>
          </div>
        </div>

        {/* Botón de favoritos */}
        <button
          className={styles.wishlistButton}
          onClick={handleLike}
        >
          <Heart fill={isLiked ? "#ef4444" : "none"} color={isLiked ? "#ef4444" : "#6b7280"} />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.nom_pro}</h3>

          <div className={styles.priceContainer}>
            <span className={styles.price}>
              ${formatNumber(product.pre_pro)}
            </span>
          </div>

          {/* Mostrar colores solo si existen */}
          {displayColors.length > 0 && (
            <div className={styles.colors}>
              {displayColors.slice(0, 3).map((color, index) => (
                <div
                  key={`color-${index}`}
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

      {/* Vista rápida modal */}
      <ProductQuickView
        data={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        img={imgDefault}
      />
    </div>
  )
}

export default ProductCard


