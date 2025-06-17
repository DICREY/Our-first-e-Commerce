import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./ProductQuickView.module.css";

const ProductQuickView = ({ product, isOpen, onClose }) => {
  if (!product) return null;

  // Calcular descuento si hay precio original
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.pre_pro) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.nom_pro}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img
            src={product.img_pro || "/placeholder.svg?height=400&width=300"}
            alt={product.nom_pro}
            className={styles.image}
          />
        </div>

        <div className={styles.details}>
          <h3 className={styles.title}>{product.nom_pro}</h3>

          <div className={styles.priceContainer}>
            <span className={styles.price}>${product.pre_pro}</span>
            {product.originalPrice && (
              <>
                <span className={styles.originalPrice}>
                  ${product.originalPrice || 0}
                </span>
                {discount > 0 && (
                  <span className={styles.discountBadge}>{discount}% OFF</span>
                )}
              </>
            )}
          </div>

          <div>
            <p className={styles.sectionTitle}>Descripción</p>
            <p className={styles.description}>{product.des_pro}</p>
          </div>

          <div>
            <p className={styles.sectionTitle}>Tallas disponibles</p>
            {console.log(product)}
            <div className={styles.attributes}>
              {product.sizes?.split('---')?.map((size) => (
                <span key={size} className={styles.attribute}>
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className={styles.sectionTitle}>Colores disponibles</p>
            <div className={styles.attributes}>
              {product.colors?.map((color) => (
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