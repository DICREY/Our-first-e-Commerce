// Librarys 
import React, { useState, useEffect } from 'react'
import {
    ArrowLeft,
    Edit,
    Package,
    Tag,
    BarChart2,
    Layers,
    Truck,
    AlertCircle,
    CheckCircle,
    XCircle,
    Image as ImageIcon,
    Check,
    Trash2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Imports 
import { ModifyData, PostData } from '../../Utils/Requests'
import { CheckImage, errorStatusHandler, formatDate, formatNumber, showAlert, showAlertLoading, showAlertSelect } from '../../Utils/utils'
import AdminLoadingScreen from '../Global/Loading'

// Import styles 
import styles from '../../styles/Details/ProductDetail.module.css'

// Component 
export const ProductDetailAdmin = ({ URL = '', imgDefault = '' }) => {
    // Dynamic vars 
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('details')
    const [currentImage, setCurrentImage] = useState(null)
    const [imgExpand, setImgExpand] = useState(null)
    
    // Vars
    const navigate = useNavigate()
    const ID = localStorage.getItem('id_pro') || 0
    let didFetch = false

    // Requests
    const fetchProduct = async () => {
        if (didFetch) return
        try {
            const data = await PostData(`${URL}/products/by`,{ by: ID })
            didFetch = true
            setLoading(false)
            if (data && data[0]) {
                setProduct(data[0])
                setCurrentImage(data[0]?.img_default)
            }
        } catch (err) {
            setLoading(false)
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }

    // Effects
    useEffect(() => {
        if (ID) fetchProduct()
    }, [ID, URL])

    const handleStatusChange = async (id) => {
        const option = showAlertSelect('Cambiar estado','¿Desea cambiar el estado del producto?','question')
        const handle = async () => {
            try {
                showAlertLoading('Cambiando estado del producto', 'Por favor, espere...', 'info')
                const data = await ModifyData(`${URL}/products/change-status`,{ by: id })
                if (data.success) {
                    showAlert('Éxito', 'Estado del producto cambiado correctamente', 'success')
                    fetchProduct()
                }
            } catch (err) {
                const message = errorStatusHandler(err)
                showAlert('Error', message, 'error')
            }
        }
        if ((await option).isConfirmed) await handle()
    }

    if (!ID && !loading) {
        return (
            <div className={styles.notFoundContainer}>
                <h2>Producto no encontrado</h2>
                <p>No se pudo cargar la información del producto solicitado.</p>
                <button
                    onClick={() => navigate('/admin/products')}
                    className={styles.backButton}
                >
                    <ArrowLeft size={16} /> Volver a productos
                </button>
            </div>
        )
    }

    return (
        <>
            {loading? (
                <AdminLoadingScreen message='Cargando detalles del Producto' />
            ):(
                <main className={styles.adminProductDetail}>
                    <header className={styles.header}>
                        <button
                            onClick={() => navigate('/admin/products')}
                            className={styles.backButton}
                        >
                            <ArrowLeft size={18} /> Volver
                        </button>
                        <h1>{product.nom_pro}</h1>
                        <div className={styles.headerActions}>
                            <span className={`${styles.statusBadge} ${product.stock_total <= 0 ? styles.statusInactive :
                                    product.onSale ? styles.statusSale :
                                        styles.statusActive
                                }`}>
                                {product.stock_total <= 0 ? (
                                    <>
                                        <XCircle size={16} /> Agotado
                                    </>
                                ) : product.offers ? (
                                    <>
                                        <Tag size={16} /> En oferta
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={16} /> Activo
                                    </>
                                )}
                            </span>
                            <button
                                onClick={() => navigate(`/admin/products/edit/${ID}`)}
                                className={styles.editButton}
                            >
                                <Edit size={16} /> Editar
                            </button>
                            {product?.sta_pro === "NO-DISPONIBLE"? (
                                <button
                                    onClick={() => handleStatusChange(product.id_pro)}
                                    className={styles.activeButton}
                                >
                                    <Check size={16} />
                                    Activar
                                </button>
                            ):(
                                <button
                                    onClick={() => handleStatusChange(product.id_pro)}
                                    className={styles.deleteButton}
                                >
                                    <Trash2 size={16} />
                                    Desactivar
                                </button>
                            )}
                        </div>
                    </header>

                    <section className={styles.contentContainer}>
                        <div className={styles.productGallery}>
                            {product?.colors? (
                                <>
                                    <div 
                                        className={styles.mainImage}
                                            onClick={() => setImgExpand(currentImage)}
                                    >
                                        {currentImage && (
                                            <CheckImage
                                                src={currentImage}
                                                alt={product.nom_pro}
                                                imgDefault={imgDefault}
                                            />
                                        )}
                                    </div>
                                    <div className={styles.thumbnailContainer}>
                                        {product?.colors?.map((color, index) => (
                                            <div
                                                key={index}
                                                className={`${styles.thumbnail} ${currentImage === index ? styles.active : ''}`}
                                                onClick={() => setCurrentImage(color.url_img)}
                                            >
                                                <CheckImage 
                                                    src={color.url_img} 
                                                    alt={`Variante ${color.nom_col}`} 
                                                    imgDefault={imgDefault}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className={styles.noImages}>
                                    <ImageIcon size={48} />
                                    <p>No hay imágenes disponibles</p>
                                </div>
                            )}
                        </div>

                        <div className={styles.productContent}>
                            <nav className={styles.tabs}>
                                <button
                                    className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('details')}
                                >
                                    <Package size={18} /> Detalles
                                </button>
                                <button
                                    className={`${styles.tab} ${activeTab === 'inventory' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('inventory')}
                                >
                                    <Layers size={18} /> Inventario
                                </button>
                                <button
                                    className={`${styles.tab} ${activeTab === 'pricing' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('pricing')}
                                >
                                    <Tag size={18} /> Precios
                                </button>
                                <button
                                    className={`${styles.tab} ${activeTab === 'shipping' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('shipping')}
                                >
                                    <Truck size={18} /> Envío
                                </button>
                                <button
                                    className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('analytics')}
                                >
                                    <BarChart2 size={18} /> Analytics
                                </button>
                            </nav>

                            <div className={styles.tabContent}>
                                {activeTab === 'details' && (
                                    <div className={styles.detailsSection}>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>ID del producto:</span>
                                            <span className={styles.detailValue}>#{product.id_pro}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Nombre del Producto:</span>
                                            <span className={styles.detailValue}>{product.nom_pro}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Categoría:</span>
                                            <span className={styles.detailValue}>{product.nom_cat_pro}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Descripción:</span>
                                            <p className={styles.detailValue}>{product.des_pro || 'No hay descripción disponible'}</p>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Fecha de creación:</span>
                                            <span className={styles.detailValue}>
                                                {formatDate(product.created_at)}
                                            </span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Última actualización:</span>
                                            <span className={styles.detailValue}>
                                                {formatDate(product.updated_at)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'inventory' && (
                                    <div className={styles.inventorySection}>
                                        <div className={styles.stockStatus}>
                                            <div className={styles.stockIndicator}>
                                                <span className={styles.stockLabel}>Stock disponible:</span>
                                                <span className={`${styles.stockValue} ${product.stock_total <= 0 ? styles.outOfStock :
                                                        product.stock_total < 10 ? styles.lowStock : ''
                                                    }`}>
                                                    {product.stock_total} unidades
                                                </span>
                                            </div>
                                            <div className={styles.stockActions}>
                                                <button className={styles.stockButton}>
                                                    Añadir stock
                                                </button>
                                                <button className={styles.stockButton}>
                                                    Registrar entrada
                                                </button>
                                            </div>
                                        </div>

                                        <h3>Variantes de color</h3>
                                        <div className={styles.variantsGrid}>
                                            {product.colors? (
                                                product?.colors?.map((color, index) => (
                                                    <div 
                                                        key={index} 
                                                        className={styles.variantCard}
                                                        onClick={() => setCurrentImage(color.url_img)}
                                                    >
                                                        <div className={styles.variantColor} style={{ backgroundColor: color.hex_col }}>
                                                            <CheckImage 
                                                                src={color.url_img} 
                                                                alt={color.nom_col} 
                                                                imgDefault={imgDefault}
                                                            />
                                                        </div>
                                                        <div className={styles.variantInfo}>
                                                            <span className={styles.variantName}>{color.nom_col}</span>
                                                            <span className={styles.variantStock}>{color.hex_col || 0} </span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className={styles.noVariants}>
                                                    <AlertCircle size={24} />
                                                    <p>No hay variantes de color registradas</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'pricing' && (
                                    <div className={styles.pricingSection}>
                                        <div className={styles.priceRow}>
                                            <span className={styles.priceLabel}>Costo:</span>
                                            <span className={styles.priceValue}>${formatNumber(product.pre_ori_pro || 'N/A')}</span>
                                        </div>
                                        <div className={styles.priceRow}>
                                            <span className={styles.priceLabel}>Precio base:</span>
                                            <span className={styles.priceValue}>${formatNumber(product.pre_pro)}</span>
                                        </div>
                                        <div className={styles.priceRow}>
                                            <span className={styles.priceLabel}>Margen de ganancia:</span>
                                            <span className={styles.priceValue}>
                                                {product.pre_ori_pro ?
                                                    `${Math.round(((product.pre_pro - product.pre_ori_pro) / product.pre_ori_pro) * 100)}%` :
                                                    'N/A'}
                                            </span>
                                        </div>

                                        {product.offers && product.offers?.map((off,idx) => (
                                            <>
                                                <div className={styles.divider}></div>
                                                <div className={styles.priceRow}>
                                                    <span className={styles.priceLabel}>En oferta:</span>
                                                    <span className={styles.saleBadge}>Sí</span>
                                                </div>
                                                <div className={styles.priceRow}>
                                                    <span className={styles.priceLabel}>Precio original:</span>
                                                    <span className={styles.originalPrice}>${formatNumber(product.pre_pro)}</span>
                                                </div>
                                                <div className={styles.priceRow}>
                                                    <span className={styles.priceLabel}>Descuento:</span>
                                                    <span className={styles.discountValue}>
                                                        ${formatNumber(product.pre_pro - ((product.pre_pro * off.por_des_ofe) / 100))} - {off.por_des_ofe}%
                                                    </span>
                                                </div>
                                                <div className={styles.priceRow}>
                                                    <span className={styles.priceLabel}>Fecha fin oferta:</span>
                                                    <span className={styles.priceValue}>
                                                        {off.fec_fin_ofe ?
                                                            formatDate(off.fec_fin_ofe) :
                                                            'No especificada'}
                                                    </span>
                                                </div>
                                            </>
                                        ))}

                                        <div className={styles.pricingActions}>
                                            <button className={styles.primaryButton}>
                                                {product.onSale ? 'Modificar oferta' : 'Crear oferta'}
                                            </button>
                                            <button className={styles.secondaryButton}>
                                                Historial de precios
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'shipping' && (
                                    <div className={styles.shippingSection}>
                                        <div className={styles.shippingInfo}>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Peso:</span>
                                                <span className={styles.infoValue}>{product.peso || 'N/A'} kg</span>
                                            </div>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Dimensiones:</span>
                                                <span className={styles.infoValue}>
                                                    {product.ancho || 'N/A'} x {product.alto || 'N/A'} x {product.profundidad || 'N/A'} cm
                                                </span>
                                            </div>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Tipo de envío:</span>
                                                <span className={styles.infoValue}>
                                                    {product.tipo_envio || 'Estándar'}
                                                </span>
                                            </div>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Costo de envío:</span>
                                                <span className={styles.infoValue}>
                                                    ${formatNumber(product.costo_envio || 0)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.shippingRestrictions}>
                                            <h3>Restricciones de envío</h3>
                                            <div className={styles.restrictionItem}>
                                                <input type="checkbox" id="international" checked={product.envio_internacional} readOnly />
                                                <label htmlFor="international">Disponible para envío internacional</label>
                                            </div>
                                            <div className={styles.restrictionItem}>
                                                <input type="checkbox" id="fragile" checked={product.fragil} readOnly />
                                                <label htmlFor="fragile">Producto frágil</label>
                                            </div>
                                            <div className={styles.restrictionItem}>
                                                <input type="checkbox" id="oversized" checked={product.gran_tamano} readOnly />
                                                <label htmlFor="oversized">Producto de gran tamaño</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'analytics' && (
                                    <div className={styles.analyticsSection}>
                                        <div className={styles.analyticsGrid}>
                                            <div className={styles.metricCard}>
                                                <div className={styles.metricHeader}>
                                                    <BarChart2 size={20} />
                                                    <span>Vistas</span>
                                                </div>
                                                <div className={styles.metricValue}>1,245</div>
                                                <div className={styles.metricTrend}>
                                                    <span className={styles.trendUp}>+12%</span> vs último mes
                                                </div>
                                            </div>
                                            <div className={styles.metricCard}>
                                                <div className={styles.metricHeader}>
                                                    <Package size={20} />
                                                    <span>Ventas</span>
                                                </div>
                                                <div className={styles.metricValue}>{product?.ventas_mes || 0}</div>
                                                <div className={styles.metricTrend}>
                                                    <span className={styles.trendUp}>+5%</span> vs último mes
                                                </div>
                                            </div>
                                            <div className={styles.metricCard}>
                                                <div className={styles.metricHeader}>
                                                    <Tag size={20} />
                                                    <span>Tasa de conversión</span>
                                                </div>
                                                <div className={styles.metricValue}>6.99%</div>
                                                <div className={styles.metricTrend}>
                                                    <span className={styles.trendDown}>-0.5%</span> vs último mes
                                                </div>
                                            </div>
                                            <div className={styles.metricCard}>
                                                <div className={styles.metricHeader}>
                                                    <Truck size={20} />
                                                    <span>Devoluciones</span>
                                                </div>
                                                <div className={styles.metricValue}>3</div>
                                                <div className={styles.metricTrend}>
                                                    <span className={styles.trendDown}>-2%</span> vs último mes
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.chartPlaceholder}>
                                            <p>Gráfico de rendimiento del producto</p>
                                            <div className={styles.chart}>
                                                {/* Aquí iría un gráfico real en implementación */}
                                                <div className={styles.chartLines}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                    {imgExpand && (
                        <picture 
                            onClick={() => setImgExpand(null)}
                            className='activeImg'
                        >
                            <CheckImage
                                src={imgExpand}
                                imgDefault={imgDefault}
                            />
                        </picture>
                    )}
                </main>
            )}
        </>
    )
}