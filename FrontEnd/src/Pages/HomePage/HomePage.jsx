// Librarys 
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { ChevronRight } from "lucide-react"

// Imports
import HeroSection from "../../components/HeroSection/HeroSection"
import ProductCard from "../../components/Products/ProductCard"
import Badge from "../../components/Badge/Badge"
import Button from "../../components/Button/Button"
import { errorStatusHandler, showAlert } from "../../Utils/utils"
import { GetData } from "../../Utils/Requests"

// Import styles 
import styles from "./HomePage.module.css"

// Component 
export const HomePage = ({ URL = '', imgProduct = '', setProduct }) => {
  // Dynamic vars 
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sellest, setSellest] = useState(null)
  const [categorie, setCategories] = useState([])
  const saleProducts = sellest?.filter((product) => product.onSale)

  // Vars 
  const mainUrl = `${URL}/stats`

  // Get products sellest 
  const GetSellest = async () => {
    try {
      const prod = await GetData(`${mainUrl}/sellest`)
      if (prod) {
        setSellest(prod)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', String(message), 'error')
    }
  }

  // Effects
  useEffect(() => {
    GetSellest()
  }, [])

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <HeroSection URL={URL} imgDefault={imgProduct} />

      {/* Features */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🚚</div>
              <h3 className={styles.featureTitle}>Envío Gratis</h3>
              <p className={styles.featureDescription}>
                En compras mayores a $75. Recibe tu pedido en 2-3 días hábiles.
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIconSuccess}>🛡️</div>
              <h3 className={styles.featureTitle}>Compra Segura</h3>
              <p className={styles.featureDescription}>
                Tus datos están protegidos con encriptación de nivel bancario.
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIconAccent}>❤️</div>
              <h3 className={styles.featureTitle}>Satisfacción Garantizada</h3>
              <p className={styles.featureDescription}>
                30 días para devoluciones. Tu satisfacción es nuestra prioridad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <Badge variant="accent">Productos Destacados</Badge>
            <h2 className={styles.sectionTitle}>Lo Más Popular</h2>
            <p className={styles.sectionDescription}>
              Descubre los productos favoritos de nuestras clientas. Piezas seleccionadas por su calidad y estilo.
            </p>
          </div>

          <div className={styles.productsGrid}>
            {sellest?.map((product, index) => (
              <ProductCard
                key={index + 129}
                data={product}
                imgDefault={imgProduct}
                set={setProduct}
              />
            ))}
          </div>

          <div className={styles.sectionFooter}>
            <Button variant="outline" size="lg">
              <NavLink to={"/products/all"} variant="outline" size="lg">
                Ver Todos los Productos 
              </NavLink>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </section>

      {/* Sale Section */}
      {saleProducts && (
        <section className={styles.saleSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Badge variant="warning">Ofertas Especiales</Badge>
              <h2 className={styles.sectionTitle}>Hasta 50% de Descuento</h2>
              <p className={styles.sectionDescription}>
                Aprovecha nuestras ofertas por tiempo limitado. ¡Los mejores precios del año!
              </p>
            </div>

            <div className={styles.productsGrid}>
              {saleProducts?.map((product, index) => (
                <ProductCard
                  key={index + 98}
                  data={product}
                  imgDefault={imgProduct}
                  set={setProduct}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Explora por Categoría</h2>
            <p className={styles.sectionDescription}>
              Encuentra exactamente lo que buscas navegando por nuestras categorías cuidadosamente organizadas.
            </p>
          </div>

          <div className={styles.tabs}>
            <div className={styles.tabsList}>
              {categorie?.map((category) => (
                <button
                  key={category}
                  className={`${styles.tab} ${selectedCategory === category ? styles.tabActive : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className={styles.tabContent}>
              <div className={styles.productsGrid}>
                {(selectedCategory === "Todos" ? sellest : sellest?.filter((p) => p.cat_pro === selectedCategory))
                  ?.slice(0, 8)
                  ?.map((product, index) => (
                    <ProductCard
                      key={index + 789}
                      data={product}
                      imgDefault={imgProduct}
                      set={setProduct}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsletterContent}>
            <h2 className={styles.newsletterTitle}>Mantente al Día con las Últimas Tendencias</h2>
            <p className={styles.newsletterDescription}>
              Suscríbete a nuestro newsletter y recibe un 15% de descuento en tu primera compra, además de acceso
              exclusivo a ofertas y nuevos productos.
            </p>

            <div className={styles.newsletterForm}>
              <input type="email" placeholder="Tu email" className={styles.newsletterInput} />
              <Button variant="secondary" size="lg">
                Suscribirse
              </Button>
            </div>

            <p className={styles.newsletterDisclaimer}>
              Al suscribirte, aceptas recibir emails promocionales. Puedes darte de baja en cualquier momento.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
