//Library imports
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

//Imports
import { useCart } from "../../../Contexts/CartContext"
import { CheckImage, formatNumber, errorStatusHandler, showAlert } from "../../../Utils/utils"
import { GetData, PostData } from "../../../Utils/Requests"
import ProductCard from "../../Products/ProductCard"
import RelatedProductsCarousel from "../../Products/RelatedProductsCarousel"

//Styles
import styles from "./ProductDetailPage.module.css"

const ProductDetailPage = ({ URL = '', img = '' }) => {
  // Dynamic vars 
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState({})
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const { productId } = useParams();
  const [activeTab, setActiveTab] = useState('description')

  // Get product ID from URL params
  const navigate = useNavigate()
  const { addToCart } = useCart()

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        console.log("Fetching product data for ID:", productId);

        const productData = await PostData(`${URL}/products/by`, { by: productId });
        console.log("Product data fetched:", productData);

        const prod = productData?.[0] || productData?.result?.[0] || productData?.product || productData;
        console.log("Product extracted:", prod);

        if (prod?.nom_pro) {
          setProduct(prod);
          setSelectedColor(prod?.colors?.[0]?.nom_col || '');
          setSelectedImage(prod?.colors?.[0]?.url_img || '');
          setSelectedSize(prod?.sizes?.[0] || null);

          // Elimina la sección de relatedProducts del estado ya que ahora usamos el componente separado
        } else {
          setProduct({});
        }
      } catch (err) {
        console.error("Error loading product:", errorStatusHandler(err))
        setProduct({})
        showAlert('Error', errorStatusHandler(err), 'error')
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [URL, productId]);

  const handleQuickAdd = () => {
    addToCart(product, selectedSize, selectedColor, quantity)
  }

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando producto...</p>
      </div>
    )
  }

  if (!product.nom_pro) {
    return (
      <div className={styles.notFound}>
        <h2 className={styles.notFoundTitle}>Producto no encontrado</h2>
        <p className={styles.notFoundText}>
          Lo sentimos, no pudimos encontrar el producto que buscas.
        </p>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          Volver al catálogo
        </button>
      </div>
    )
  }

  // Calculate discount if there's an original price
  const discount = product.price && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Product Main Section */}
        <section className={styles.productMain}>
          <div className={styles.imageGallery}>
            <div className={styles.thumbnailContainer}>
              {product.colors?.map((color, index) => (
                <picture
                  key={index}
                  onClick={() => {
                    setSelectedImage(color.url_img)
                    setSelectedColor(color.nom_col)
                  }}
                >
                  <CheckImage
                    imgDefault={img}
                    src={color.url_img}
                    alt={`Color ${color.nom_col}`}
                    className={`${styles.thumbnail} ${selectedColor === color.nom_col ? styles.active : ""
                      }`}
                  />
                </picture>
              ))}
            </div>
            <div className={styles.mainImageContainer}>
              <CheckImage
                imgDefault={img}
                src={selectedImage}
                alt={product.nom_pro}
                className={styles.mainImage}
              />
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.productHeader}>
              <h1 className={styles.title}>{product.nom_pro}</h1>
              <div className={styles.rating}>
                <div className={styles.stars}>★★★★★</div>
                <span className={styles.reviewsCount}>({reviews.length} reseñas)</span>
              </div>
            </div>

            <div className={styles.priceContainer}>
              <p className={styles.price}>${formatNumber(product.pre_pro)}</p>
              {product.originalPrice && (
                <>
                  <p className={styles.originalPrice}>
                    ${formatNumber(product.originalPrice)}
                  </p>
                  {discount > 0 && (
                    <span className={styles.discountBadge}>{discount}% OFF</span>
                  )}
                </>
              )}
            </div>

            <div className={styles.attributes}>
              {product.colors?.length > 0 && (
                <div className={styles.attributeGroup}>
                  <span className={styles.attributeTitle}>Color: {selectedColor}</span>
                  <div className={styles.colorOptions}>
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className={`${styles.colorOption} ${selectedColor === color.nom_col ? styles.active : ""
                          }`}
                        style={{ backgroundColor: color.hex_col }}
                        onClick={() => {
                          setSelectedColor(color.nom_col)
                          setSelectedImage(color.url_img)
                        }}
                        title={color.nom_col}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes?.length > 0 && (
                <div className={styles.attributeGroup}>
                  <span className={styles.attributeTitle}>Talla</span>
                  <div className={styles.sizeOptions}>
                    {product.sizes.map((size, index) => (
                      <div
                        key={index}
                        className={`${styles.sizeOption} ${selectedSize === size ? styles.active : ""
                          }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <div className={styles.quantitySelector}>
                <button
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  readOnly
                  className={styles.quantityInput}
                />
                <button
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
              <button
                className={styles.primaryButton}
                onClick={handleQuickAdd}
              >
                Añadir al carrito
              </button>
              <button className={styles.secondaryButton}>Comprar ahora</button>
            </div>

            <div className={styles.productMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>SKU:</span>
                <span>{product.id_pro || 'N/A'}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Categoría:</span>
                <span>{product.nom_cat_pro || 'N/A'}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Disponibilidad:</span>
                <span>{product.stock_total > 0 ? 'En stock' : 'Agotado'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Product Tabs Section */}
        <section className={styles.productTabs}>
          <div className={styles.tabHeaders}>
            <button
              className={`${styles.tabHeader} ${activeTab === 'description' ? styles.active : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Descripción
            </button>
            <button
              className={`${styles.tabHeader} ${activeTab === 'details' ? styles.active : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Detalles
            </button>
            <button
              className={`${styles.tabHeader} ${activeTab === 'reviews' ? styles.active : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reseñas ({reviews.length})
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div className={styles.descriptionContent}>
                <h3>Descripción del producto</h3>
                <p>{product.des_pro}</p>
              </div>
            )}

            {activeTab === 'details' && (
              <div className={styles.detailsContent}>
                <h3>Detalles del producto</h3>
                <ul>
                  <li><strong>Material:</strong> {product.material || 'No especificado'}</li>
                  <li><strong>Cuidados:</strong> {product.care_instructions || 'Lavar a máquina'}</li>
                  <li><strong>Origen:</strong> {product.origin || 'No especificado'}</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles.reviewsContent}>
                {reviews.length > 0 ? (
                  <>
                    <div className={styles.reviewsSummary}>
                      <div className={styles.averageRating}>
                        <span className={styles.averageNumber}>4.8</span>
                        <div className={styles.stars}>★★★★★</div>
                        <span className={styles.totalReviews}>{reviews.length} reseñas</span>
                      </div>
                      <button className={styles.writeReviewButton}>Escribir una reseña</button>
                    </div>

                    <div className={styles.reviewsList}>
                      {reviews.map((review, index) => (
                        <div key={index} className={styles.reviewItem}>
                          <div className={styles.reviewHeader}>
                            <div className={styles.reviewAuthor}>{review.author}</div>
                            <div className={styles.reviewRating}>★★★★★</div>
                            <div className={styles.reviewDate}>{review.date}</div>
                          </div>
                          <h4 className={styles.reviewTitle}>{review.title}</h4>
                          <p className={styles.reviewText}>{review.content}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className={styles.noReviews}>
                    <p>Este producto aún no tiene reseñas.</p>
                    <button className={styles.writeReviewButton}>Sé el primero en opinar</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
      {product.nom_cat_pro && (
        <RelatedProductsCarousel
          URL={URL}
          img={img}
          categoryId={product.nom_cat_pro}
        />
      )}
    </main>
  )
}

export default ProductDetailPage