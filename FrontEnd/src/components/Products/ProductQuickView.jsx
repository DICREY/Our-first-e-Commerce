import { useNavigate } from "react-router-dom"
import { useEffect, useState, useContext } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { CheckImage, errorStatusHandler, showAlert, showAlertSelect } from "../../Utils/utils";
import { PostData } from "../../Utils/Requests";
import { AuthContext } from "../../Contexts/Contexts";

// Import styles 
import styles from "../../styles/Products/ProductQuickView.module.css";

// Component 
const ProductQuickView = ({ data, isOpen, onClose, img = '', URL = '' }) => {
  // Dynamic Vars 
  const [showImg, setShowImg] = useState(null);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const navigate = useNavigate();

  // Vars 
  const { user } = useContext(AuthContext);
  const token = useContext(AuthContext)?.token || localStorage.getItem('token');

  // Cargar inventario al abrir el modal o cambiar el producto
  useEffect(() => {
    const fetchInventory = async () => {
      if (isOpen && product?.id_pro) {
        setIsLoadingInventory(true);
        try {
          const response = await PostData(`${URL}/products/by`, { by: product.id_pro })
          if (response?.[0]?.inv) setInventory(response?.[0]?.inv)
        } catch (error) {
          console.error("Error fetching inventory:", error)
          setInventory([])
        } finally {
          setIsLoadingInventory(false);
        }
      }
    };

    fetchInventory();
  }, [isOpen, product?.id_pro, URL]);

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
        setSelectedColor(firstColor);
        setShowImg(firstColor?.url_img);
      }
      if (Array.isArray(data.sizes) && data.sizes.length > 0) {
        setSelectedSize({ nom_tal_pro: data.sizes[0], id_tal_pro: data.sizes[0].id_tal_pro || data.sizes[0] });
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
    setSelectedColor(color);
    setShowImg(color.url_img);
    // Resetear la talla seleccionada al cambiar de color
    setSelectedSize(null);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize({ nom_tal_pro: size.nom_tal_pro || size, id_tal_pro: size.id_tal_pro || size });
  };

  const isInventory = (color) => {
    const found = inventory?.find(inv => inv.nom_col === color)
    return found? null:1
  }

  // Buscar el id_inv según la selección
  const getSelectedInventoryId = () => {
    if (!selectedColor || !selectedSize) return null

    const found = inventory.find(
      inv =>
        inv.nom_col === selectedColor.nom_col &&
      inv.size === selectedSize.nom_tal_pro
    )
    
    if (!found) {
      showAlert('Error', 'No se encontraron productos en el inventario', 'error')
      return
    }

    if (found.cantidad < quantity) {
      showAlert("Error", `Solo quedan ${found.cantidad} unidades disponibles`, "error");
      return null
    }
    return found.id_inv
  }

  const getAvailableSizesForColor = (color) => {
    if (!color || !inventory.length) return safeSizes

    const availableSizes = inventory
      .filter(item => item.nom_col === color.nom_col && item.cantidad > 0)
      .map(item => ({
        nom_tal_pro: item.nom_tal_pro || `Talla ${item.id_tal_inv}`,
        id_tal_pro: item.id_tal_inv
      }));

    return availableSizes.length > 0 ? availableSizes : safeSizes.map(size => ({
      nom_tal_pro: size.nom_tal_pro || size,
      id_tal_pro: size.id_tal_pro || size
    }));
  };

  const handleAddToCart = async () => {
    // 1. Validar usuario
    if (!user) {
      const option = showAlertSelect('Credenciales invalidas','Debes iniciar sesión para agregar al carrito. ¿Deseas ir al login?','question')
      if ((await option).isConfirmed) return navigate('/login')
    }

    // 2. Validar selección
    if (!selectedSize || !selectedColor) {
      showAlert('Alerta','Debes seleccionar una talla y color')
      return
    } 

    // 3. Validar inventario
    const id_inv = await getSelectedInventoryId();
    if (!id_inv) {
      showAlert('Error',"No hay inventario disponible",'error')
      return;
    }

    setIsAddingToCart(true);

    try {
      // 4. Llamada API
      console.log(user)
      const add = await PostData(`${URL}/products/cart/add`, {
        user: user.email,
        id_inv,
        quantity: quantity
      })

      // 5. Éxito
      if(add) showAlert('Producto Agregado', 'Producto agregado correctamente al carrito', 'success')
      onClose()
    } catch (error) {
      const message = errorStatusHandler(error)
      showAlert('Error',message, 'error')
    } finally {
      setIsAddingToCart(false);
    }
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
                  className={`${styles.colorThumbnail} ${selectedColor?.nom_col === color.nom_col ? styles.active : ''}`}
                  onClick={() => handleColorSelect(color)}
                  style={{ backgroundColor: color.hex_col }}
                  title={color.nom_col}
                  aria-label={`Color ${color.nom_col}`}
                  disabled={isInventory(color.nom_col)?1:null}
                >{isInventory(color.nom_col) && (<p className="floatText">0 u</p>)}</button>
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
                  <span className={styles.discountBadge}>
                    {Math.round(((product.originalPrice - product.pre_pro) / product.originalPrice) * 100)}% OFF
                  </span>
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

          {selectedColor && getAvailableSizesForColor(selectedColor).length > 0 && (
            <div className={styles.sizesSection}>
              <h4 className={styles.sectionTitle}>Tallas disponibles</h4>
              {isLoadingInventory ? (
                <div className={styles.loadingSizes}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Cargando tallas...</p>
                </div>
              ) : (
                <div className={styles.sizeOptions}>
                  {getAvailableSizesForColor(selectedColor).map((size, index) => {
                    const inventoryItem = inventory.find(
                      inv =>
                        inv.nom_col === selectedColor?.nom_col &&
                        (inv.id_tal_inv === size.id_tal_pro || inv.nom_tal_pro === size.nom_tal_pro)
                    );

                    const isOutOfStock = inventoryItem?.cantidad === 0;
                    const isLowStock = inventoryItem?.cantidad < 5 && inventoryItem?.cantidad > 0;

                    return (
                      <button
                        key={`size-${index}`}
                        className={`${styles.sizeOption} ${selectedSize?.id_tal_pro === size.id_tal_pro ? styles.active : ''
                          } ${isOutOfStock ? styles.outOfStock : ''}`}
                        onClick={() => !isOutOfStock && handleSizeSelect(size)}
                        disabled={isOutOfStock}
                        title={isOutOfStock ? "Agotado" : isLowStock ? `Últimas ${inventoryItem.cantidad} unidades` : ""}
                      >
                        {size.nom_tal_pro}
                        {isOutOfStock && <span className={styles.stockBadge}>Agotado</span>}
                        {isLowStock && !isOutOfStock && (
                          <span className={styles.lowStockBadge}>{inventoryItem.cantidad}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className={styles.quantitySelector}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div className={styles.actions}>
            <Button
              variant="primary"
              onClick={handleAddToCart}
              fullWidth
              loading={isAddingToCart}
              disabled={!selectedSize || !selectedColor || isAddingToCart}
            >
              {isAddingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
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