// Librarys 
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { ChevronRight } from "lucide-react"

// Imports
import { CheckImage, errorStatusHandler, showAlert } from "../../Utils/utils"
import { GetData, PostData } from "../../Utils/Requests"
import Badge from "../Badge/Badge"

// Import styles 
import styles from "./HeroSection.module.css"

// Component 
const HeroSection = ({ URL = '', imgDefault = '' }) => {
  // Dynamic Vars 
  const [ currentProduct, setCurrentProduct ] = useState(null)
  const [ stats, setStats ] = useState(null)

  // Vars 
  let didFetch = false

  const GetCurrentProduct = async () => {
    if (didFetch) return
    try {
      const data = await GetData(`${URL}/offers/product`)
      didFetch = true
      if (data){
        setCurrentProduct(data)
      }
    } catch (err) {
      didFetch = true
      const message = errorStatusHandler(err)
      // showAlert('Error', message, 'error')
    }
  }

  const GetStats = async () => {
    try {
      const got = await GetData(`${URL}/stats/general`)
      if (got){
        setStats(got)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  useEffect(() => {
    GetStats()
    GetCurrentProduct()
  },[])

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Content */}
          <div className={styles.content}>
            <div className={styles.textContent}>
              <Badge variant="accent">✨ Nueva Colección Primavera</Badge>

              <h1 className={styles.title}>
                Descubre tu
                <span className={styles.titleGradient}> estilo único</span>
              </h1>

              <p className={styles.description}>
                Explora nuestra colección de ropa femenina diseñada para mujeres que buscan elegancia, comodidad y
                estilo en cada ocasión.
              </p>
            </div>

            <div className={styles.actions}>
              <NavLink to="/productos/all" className={styles.primaryButton}>
                Explorar Colección
                <ChevronRight className={styles.arrow} />
              </NavLink>

              <button className={styles.secondaryButton}>Ver Ofertas</button>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>{stats?.cant_usu_reg}+</div>
                <div className={styles.statLabel}>Clientas Felices</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>{stats?.cant_pro_reg}+</div>
                <div className={styles.statLabel}>Productos</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>4.9★</div>
                <div className={styles.statLabel}>Calificación</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <section className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <CheckImage
                src={currentProduct?.img_default}
                alt="Modelo usando ropa de la nueva colección"
                className={styles.heroImage}
                imgDefault={imgDefault}
              />

              {currentProduct && (
                <>
                  <div className={styles.floatingDiscount}>
                    <div className={styles.discountNumber}>-{currentProduct?.por_des_ofe || 0}%</div>
                    <div className={styles.discountLabel}>Descuento</div>
                  </div>

                  <div className={styles.floatingFeature}>
                    <div className={styles.featureIcon}>
                      <span style={{ color: "var(--success-600)" }}>✓</span>
                    </div>
                    <div>
                      <div className={styles.featureTitle}>{currentProduct?.nom_ofe}</div>
                      <div className={styles.featureDescription}>{currentProduct?.des_ofe}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
