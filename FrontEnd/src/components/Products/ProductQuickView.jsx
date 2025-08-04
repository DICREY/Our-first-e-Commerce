import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { CheckImage } from "../../Utils/utils";
import styles from "../../styles/Products/ProductQuickView.module.css";

const ProductQuickView = ({ data, isOpen, onClose, img = '' }) => {
  const [showImg, setShowImg] = useState(null);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!data) return null;

  // Calcular descuento si hay precio original
  const discount = product?.originalPrice
    ? Math.round(((product?.originalPrice - product?.pre_pro) / product?.originalPrice) * 100)
    : 0;

  useEffect(() => {
    if (data) {
      setProduct(data);
      if (data.colors) {
        const firstColor = Array.isArray(data.colors) ? data.colors[0] : 
          typeof data.colors === "string" ? 
          data.colors.split("---").map(colorStr => {
            const [nom_col, hex_col, nom_img, url_img] = colorStr.split(";");
            return { nom_col, hex_col, nom_img, url_img };
          })[0] : null;
        setSelectedColor(firstColor?.nom_col);
        setShowImg(firstColor?.url_img);
      }
    }
  }, [data]);

  const safeColors = Array.isArray(product?.colors)
    ? product.colors
    : typeof product?.colors === "string"
      ? product.colors.split("---").map(colorStr => {
          const [nom_col, hex_col, nom_img, url_img] = colorStr.split(";");
          return { nom_col, hex_col, nom_img, url_img };
        })
      : [];

  const safeSizes = Array.isArray(product?.sizes) 
    ? product.sizes 
    : typeof product?.sizes === "string"
      ? product.sizes.split("---")
      : [];

  const handleColorSelect = (color) => {
    setImageLoaded(false);
    setSelectedColor(color.nom_col);
    setShowImg(color.url_img);
  };

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product?.nom_pro} size="lg">
      <section className={styles.container}>
        <div className={styles.imageSection}>
          <div className={styles.mainImageContainer}>
            <CheckImage
              src={showImg || img}
              alt={product.nom_pro}
              imgDefault={img}
              className={`${styles.mainImage} ${imageLoaded ? styles.loaded : styles.loading}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          
          {safeColors.length > 0 && (
            <div className={styles.colorThumbnails}>
              {safeColors.map((color, index) => (
                <button
                  key={`color-${index}`}
                  className={`${styles.colorThumbnail} ${selectedColor === color.nom_col ? styles.active : ''}`}
                  onClick={() => handleColorSelect(color)}
                  style={{ backgroundColor: color.hex_col }}
                  title={color.nom_col}
                  aria-label={`Color ${color.nom_col}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.header}>
            <h3 className={styles.title}>{product.nom_pro}</h3>
            <div className={styles.priceContainer}>
              <span className={styles.price}>${product.pre_pro.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className={styles.originalPrice}>
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <span className={styles.discountBadge}>{discount}% OFF</span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className={styles.descriptionSection}>
            <h4 className={styles.sectionTitle}>Descripción</h4>
            <p className={styles.description}>
              {product.des_pro || "No hay descripción disponible."}
            </p>
          </div>

          {safeSizes.length > 0 && (
            <div className={styles.sizesSection}>
              <h4 className={styles.sectionTitle}>Tallas disponibles</h4>
              <div className={styles.sizeOptions}>
                {safeSizes.map((size, index) => (
                  <span key={`size-${index}`} className={styles.sizeOption}>
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {safeColors.length > 0 && (
            <div className={styles.colorsSection}>
              <h4 className={styles.sectionTitle}>Colores disponibles</h4>
              <div className={styles.colorOptions}>
                {safeColors.map((color, index) => (
                  <button
                    key={`color-option-${index}`}
                    className={`${styles.colorOption} ${selectedColor === color.nom_col ? styles.active : ''}`}
                    onClick={() => handleColorSelect(color)}
                    title={color.nom_col}
                    aria-label={`Seleccionar color ${color.nom_col}`}
                  >
                    <span 
                      className={styles.colorSwatch} 
                      style={{ backgroundColor: color.hex_col }}
                    />
                    <span className={styles.colorName}>{color.nom_col}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <Button variant="primary" fullWidth>
              Añadir al carrito
            </Button>
            <Button variant="outline" onClick={onClose} fullWidth>
              Continuar comprando
            </Button>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default ProductQuickView;