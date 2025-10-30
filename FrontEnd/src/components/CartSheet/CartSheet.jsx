// Librarys 
import { useContext, useEffect, useState } from "react"
import { ShoppingBag } from 'lucide-react'

// Imports 
import { useCart } from "../../Contexts/CartContext"
import { AuthContext } from "../../Contexts/Contexts"
import { CheckImage, errorStatusHandler, formatNumber } from "../../Utils/utils"
import { PostData, ModifyData } from "../../Utils/Requests"
import Badge from "../Badge/Badge"

// Import styles 
import styles from "./CartSheet.module.css"

// Component
const CartSheet = ({ URL = '', isOpen, onClose, imgProductDefault = '' }) => {
  // Dynamic vars
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useContext(AuthContext)

  // Obtener carrito del backend
  const fetchCart = async () => {
    try {
      setLoading(true)
      // Cambia GetData por PostData y envía el documento en el body
      const data = await PostData(`${URL}/products/cart/by`, {
        email: user?.email
      })
      setCartItems(data)
    } catch (error) {
      const message = errorStatusHandler(error)
      console.error(message)
    } finally {
      setLoading(false)
    }
  }

  // Actualizar cantidad
  const updateQuantity = async (cartId, newQuantity) => {
    try {
      await ModifyData(`${URL}/products/cart/update`, {
        doc_per: user?.doc,
        cartId,
        newQuantity
      })
      fetchCart()
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  // Eliminar del carrito
  const removeFromCart = async (cartId) => {
    try {
      await PostData(`${URL}/products/cart/remove`, {
        doc_per: user?.doc,
        cartId
      })
      fetchCart()
    } catch (error) {
      console.error("Error removing from cart:", error)
    }
  }

  // Calcular total
  const getTotalPrice = () => {
    return formatNumber(cartItems.reduce((total, item) => total + (item.pre_pro * item.cantidad), 0))
  }

  // Calcular total de items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0)
  }

  useEffect(() => {
    if (isOpen) {
      fetchCart()
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
      <main className={`${styles.sheet} ${isOpen && styles.open}`}>
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
          {loading ? (
            <div className={styles.emptyState}>
              <p>Cargando carrito...</p>
            </div>
          ) : cartItems?.length === 0 ? (
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
                  {cartItems?.map((item, index) => (
                    <div key={index + 908} className={styles.item}>
                      <div className={styles.itemImage}>
                        <CheckImage
                          src={item.imagen || imgProductDefault}
                          alt={item.nom_pro}
                          imgDefault={imgProductDefault}
                        />
                      </div>

                      <div className={styles.itemDetails}>
                        <h4 className={styles.itemName}>{item.nom_pro}</h4>
                        <div className={styles.itemMeta}>
                          <span className={styles.itemMetaText}>Talla: {item.nom_tal_pro}</span>
                          <span className={styles.itemMetaText}>Color: {item.nom_col}</span>
                        </div>
                        <div className={styles.itemFooter}>
                          <span className={styles.itemPrice}>${formatNumber(item.pre_pro)}</span>
                          <div className={styles.itemControls}>
                            <button
                              className={styles.quantityButton}
                              onClick={() => updateQuantity(item.id_car, item.cantidad - 1)}
                              disabled={item.cantidad <= 1}
                            >
                              −
                            </button>
                            <span className={styles.quantity}>{item.cantidad}</span>
                            <button
                              className={styles.quantityButton}
                              onClick={() => updateQuantity(item.id_car, item.cantidad + 1)}
                              disabled={item.cantidad >= item.stock_disponible}
                            >
                              +
                            </button>
                            <button
                              className={styles.removeButton}
                              onClick={() => removeFromCart(item.id_car)}
                            >
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