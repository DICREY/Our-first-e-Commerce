import Badge from "../Badge/Badge"
import styles from "./HeroSection.module.css"

const HeroSection = () => {
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
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <img
                src="/placeholder.svg?height=600&width=480"
                alt="Modelo usando ropa de la nueva colección"
                className={styles.heroImage}
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
