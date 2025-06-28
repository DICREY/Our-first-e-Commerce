// Librarys 
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Imports 
import { useCart } from "../../../Contexts/CartContext"
import { CheckImage } from "../../../Utils/utils"

// Import styles
import styles from "./ProductDetailPage.module.css"

// Component
const ProductDetailPage = ({ img = '', product = {} }) => {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product?.colors[0].nom_col || "")
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "")
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const handleQuickAdd = () => {
    addToCart(product, product.sizes[0], product.colors[0])
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2 className={styles.notFoundTitle}>Producto no encontrado</h2>
        <p className={styles.notFoundText}>
          Lo sentimos, no pudimos encontrar el producto que buscas.
        </p>
        <button className={styles.backButton} onClick={() => navigate("/")}>
          Volver al catálogo
        </button>
      </div>
    );
  }

  // Si el producto tiene múltiples imágenes (simulado)
  const productImages = Array.isArray(product.image)
    ? product.image
    : [product.image || "/placeholder.svg?height=800&width=600"];

  // Calcular descuento si hay precio original
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <main className={styles.page}>
      <main className={styles.container}>
        <header className={styles.imageGallery}>
          <div className={styles.thumbnailContainer}>
            {productImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Vista ${index + 1} de ${product.name}`}
                className={`${styles.thumbnail} ${
                  selectedImage === index ? styles.active : ""
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
          <CheckImage
            src={productImages[selectedImage]}
            alt={product.name}
            imgDefault={img}
            className={styles.mainImage}
          />
        </header>

        <section className={styles.details}>
          <h1 className={styles.title}>{product.nom_pro}</h1>

          <div className={styles.rating}>
            <div className={styles.stars}>★★★★★</div>
            <span className={styles.reviews}>(24 reseñas)</span>
          </div>

          <div className={styles.priceContainer}>
            <p className={styles.price}>${product.pre_pro.toFixed(2)}</p>
            {product.originalPrice && (
              <>
                <p className={styles.originalPrice}>
                  ${product.originalPrice.toFixed(2)}
                </p>
                {discount > 0 && (
                  <span className={styles.discountBadge}>{discount}% OFF</span>
                )}
              </>
            )}
          </div>

          <p className={styles.description}>{product.des_pro}</p>

          <div className={styles.attributes}>
            {product.colors.length > 0 && (
              <div className={styles.attributeGroup}>
                <span className={styles.attributeTitle}>Color</span>
                <div className={styles.colorOptions}>
                  {product.colors.map((color, index) => (
                    <div
                      key={index + 909}
                      className={`${styles.colorOption} ${
                        selectedColor === color.nom_col ? styles.active : ""
                      }`}
                      style={{ backgroundColor: color.hex_col }}
                      onClick={() => setSelectedColor(color.nom_col)}
                      title={color.nom_col}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className={styles.attributeGroup}>
                <span className={styles.attributeTitle}>Talla</span>
                <div className={styles.sizeOptions}>
                  {product?.sizes?.map((size, index) => (
                    <div
                      key={index + 972}
                      className={`${styles.sizeOption} ${
                        selectedSize === size ? styles.active : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <div className={styles.quantitySelector}>
              <button
                className={styles.quantityButton}
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                readOnly
                className={styles.quantityInput}
              />
              <button
                className={styles.quantityButton}
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
            <button 
            className={styles.primaryButton}
            onClick={handleQuickAdd}
            >Añadir al carrito</button>
            <button className={styles.secondaryButton}>Comprar ahora</button>
          </div>
        </section>
      </main>
    </main>
  );
};

export default ProductDetailPage;