// Librarys 
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// Imports 
import { useCart } from "../../../Contexts/CartContext"
import { CheckImage, formatNumber } from "../../../Utils/utils"

// Import styles
import styles from "./ProductDetailPage.module.css"

// Component
const ProductDetailPage = ({ img = '', product = {} }) => {
  // Dynamic vars 
  const [ selectedImage, setSelectedImage ] = useState(null)
  const [ selectedColor, setSelectedColor ] = useState("")
  const [ selectedSize, setSelectedSize ] = useState(null)
  const [ quantity, setQuantity ] = useState(1)

  // Vars 
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const handleQuickAdd = () => {
    addToCart(product, product.sizes[0], product.colors[0])
  }

  if (!product.nom_pro) {
    return (
      <div className={styles.notFound}>
        <h2 className={styles.notFoundTitle}>Producto no encontrado</h2>
        <p className={styles.notFoundText}>
          Lo sentimos, no pudimos encontrar el producto que buscas.
        </p>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          Volver al catálogo
        </button>
      </div>
    );
  }

  // Si el producto tiene múltiples imágenes (simulado)
  const productImages = product?.colors

  // Calcular descuento si hay precio original
  const discount = product.price
    ? Math.round(
        ((product.price - product.price) / product.price) * 100
      )
    : 0;

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  }

  useEffect(() => {
    if (product) {
      setSelectedColor(product?.colors[0]?.nom_col)
      setSelectedImage(product?.colors[0]?.url_img)
      setSelectedSize(product?.sizes[0])
    }
  },[])

  return (
    <main className={styles.page}>
    {product && (
      <main className={styles.container}>
        <header className={styles.imageGallery}>
          <div className={styles.thumbnailContainer}>
            {productImages?.map((imagen, index) => (
              <picture
                key={index}
                onClick={() => setSelectedImage(imagen.url_img)}
              >
                <CheckImage
                  imgDefault={img}
                  src={imagen.url_img}
                  alt={`Vista ${index + 1} de ${product.nom_pro}`}
                  className={`${styles.thumbnail} ${
                    selectedImage === index ? styles.active : ""
                  }`}
                />
              </picture>
            ))}
          </div>
          {selectedImage? (
            <img
              src={selectedImage}
              alt={product.nom_pro}
              className={styles.mainImage}
            />
          ):(
            <img
              src={img}
              alt={product.nom_pro}
              className={styles.mainImage}
            />
          )}
        </header>

        <section className={styles.details}>
          <h1 className={styles.title}>{product.nom_pro}</h1>

          <div className={styles.rating}>
            <div className={styles.stars}>★★★★★</div>
            <span className={styles.reviews}>(24 reseñas)</span>
          </div>

          <div className={styles.priceContainer}>
            <p className={styles.price}>${formatNumber(product.pre_pro)}</p>
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
                      onClick={() => {
                        setSelectedColor(color.nom_col)
                        setSelectedImage(color.url_img)
                      }}
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
    )}
    </main>
  );
};

export default ProductDetailPage;