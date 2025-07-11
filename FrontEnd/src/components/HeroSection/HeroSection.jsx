// Librarys 
import { useEffect, useState } from "react"

// Imports
import { CheckImage, errorStatusHandler } from "../../Utils/utils"
import Badge from "../Badge/Badge"

// Import styles 
import styles from "./HeroSection.module.css"
import { GetData, PostData } from "../../Utils/Requests"

// Component 
const HeroSection = ({ URL = '', imgDefault = '' }) => {
  // Dynamic Vars 
  const [ currentProduct, setCurrentProduct ] = useState()

  // Vars 
  let didFetch = false

  const GetCurrentProduct = async () => {
    if (didFetch) return
    try {
      didFetch = true
      const data = await GetData(`${URL}`)
    } catch (err) {
      const message = errorStatusHandler(err)
    }
  }
  
  const changeCurrentProduct = async () => {
    try {
      const data = await PostData(`${URL}`)
    } catch (err) {
      const message = errorStatusHandler(err)
    }
  }

  useEffect(() => {
    GetCurrentProduct()
  })

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
              <button className={styles.primaryButton}>
                Explorar Colección
                <span className={styles.arrow}>→</span>
              </button>

              <button className={styles.secondaryButton}>Ver Ofertas</button>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>10K+</div>
                <div className={styles.statLabel}>Clientas Felices</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>500+</div>
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
                src="/placeholder.svg?height=600&width=480"
                alt="Modelo usando ropa de la nueva colección"
                className={styles.heroImage}
                imgDefault={imgDefault}
              />

              {/* Floating elements */}
              <div className={styles.floatingDiscount}>
                <div className={styles.discountNumber}>-30%</div>
                <div className={styles.discountLabel}>Descuento</div>
              </div>

              <div className={styles.floatingFeature}>
                <div className={styles.featureIcon}>
                  <span style={{ color: "var(--success-600)" }}>✓</span>
                </div>
                <div>
                  <div className={styles.featureTitle}>Envío Gratis</div>
                  <div className={styles.featureDescription}>En compras +$75</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
