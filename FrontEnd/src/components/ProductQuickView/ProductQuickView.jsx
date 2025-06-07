import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./ProductQuickView.module.css";

const ProductQuickView = ({ product, isOpen, onClose }) => {
  if (!product) return null;

  // Calcular descuento si hay precio original
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img
            src={product.image || "/placeholder.svg?height=400&width=300"}
            alt={product.name}
            className={styles.image}
          />
        </div>

        <div className={styles.details}>
          <h3 className={styles.title}>{product.name}</h3>

          <div className={styles.priceContainer}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className={styles.originalPrice}>
                  ${product.originalPrice.toFixed(2)}
                </span>
                {discount > 0 && (
                  <span className={styles.discountBadge}>{discount}% OFF</span>
                )}
              </>
            )}
          </div>

          <div>
            <p className={styles.sectionTitle}>Descripción</p>
            <p className={styles.description}>{product.description}</p>
          </div>

          <div>
            <p className={styles.sectionTitle}>Tallas disponibles</p>
            <div className={styles.attributes}>
              {product.sizes.map((size) => (
                <span key={size} className={styles.attribute}>
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className={styles.sectionTitle}>Colores disponibles</p>
            <div className={styles.attributes}>
              {product.colors.map((color) => (
                <span key={color} className={styles.attribute}>
                  {color}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="primary">Añadir al carrito</Button>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductQuickView;