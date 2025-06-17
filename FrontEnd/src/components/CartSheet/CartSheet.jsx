// Librarys 
import { useEffect } from "react"
import { ShoppingBag } from 'lucide-react'

// Imports 
import { useCart } from "../../Contexts/CartContext"
import { checkImage } from "../../Utils/utils"
import Badge from "../Badge/Badge"

// Import styles 
import styles from "./CartSheet.module.css"

// Component 
const CartSheet = ({ isOpen, onClose, imgProductDefault = '' }) => {
  // Vars 
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <main className={styles.overlay} onClick={onClose} />
      <main className={`${styles.sheet} ${isOpen ? styles.open : ""}`}>
        <header className={styles.header}>
          <div className={styles.title}>
            Carrito de Compras
            <Badge variant="primary">
              {getTotalItems()} {getTotalItems() === 1 ? "artículo" : "artículos"}
            </Badge>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </header>

        <section className={styles.content}>
          {items?.length === 0 ? (
            <div className={styles.emptyState}>
              <div>
                <div className={styles.emptyIcon}><ShoppingBag /></div>
                <p className={styles.emptyTitle}>Tu carrito está vacío</p>
                <p className={styles.emptyDescription}>Agrega algunos productos para comenzar</p>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.itemsList}>
                <div className={styles.items}>
                  {items?.map((item, index) => (
                    <div key={index + 908} className={styles.item}>
                      <div className={styles.itemImage}>
                        {checkImage(
                          item.img_pro,
                          item.nom_pro,
                          imgProductDefault
                        )}
                      </div>

                      <div className={styles.itemDetails}>
                        <h4 className={styles.itemName}>{item.nom_pro}</h4>
                        <div className={styles.itemMeta}>
                          <span className={styles.itemMetaText}>Talla: {item.selectedSize}</span>
                          {/* <span className={styles.itemMetaText}>Color: {item.selectedColor}</span> */}
                        </div>
                        <div className={styles.itemFooter}>
                          <span className={styles.itemPrice}>${item.pre_pro}</span>
                          <div className={styles.itemControls}>
                            <button
                              className={styles.quantityButton}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              −
                            </button>
                            <span className={styles.quantity}>{item.quantity}</span>
                            <button
                              className={styles.quantityButton}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                            <button className={styles.removeButton} onClick={() => removeFromCart(item.id)}>
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.footer}>
                <div className={styles.total}>
                  <span className={styles.totalLabel}>Total:</span>
                  <span className={styles.totalAmount}>${getTotalPrice()}</span>
                </div>

                <div className={styles.actions}>
                  <button className={styles.checkoutButton}>Proceder al Pago</button>
                  <button className={styles.continueButton} onClick={onClose}>
                    Continuar Comprando
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  )
}

export default CartSheet
