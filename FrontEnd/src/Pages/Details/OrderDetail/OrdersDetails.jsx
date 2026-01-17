// Librarys 
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
    Calendar,
    Check,
    ChevronLeft,
    Clock,
    Package,
    PackageCheck,
    PinOff,
    RefreshCw,
    Trash2,
    Truck
} from 'lucide-react'

// Imports 
import { ModifyData, PostData } from '../../../Utils/Requests'
import { CheckImage, errorStatusHandler, formatNumber, showAlert, showAlertLoading, showAlertSelect } from '../../../Utils/utils'
import AdminLoadingScreen from '../../../components/Global/Loading'

// Import styles 
import styles from './OrdersDetail.module.css'

// Component 
export const OrderDetail = ({ URL = '', imgDefault = '' }) => {
    const [ order, setOrder ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ imgExpand, setImgExpand ] = useState(null)

    // Vars 
    const navigate = useNavigate()
    const id_ped = localStorage.getItem('id_ord') || 0
    let didFetch = false

    // Functions 
    const GetOrderDetails = async () => {
        try {
            if(didFetch) return
            const got = await PostData(`${URL}/orders/by`, {by: id_ped})
            if (got && got[0]) {
                didFetch = true
                setOrder(got[0])
                setTimeout(() => setLoading(false),200)
            }
        } catch (err) {
            setLoading(false)
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
            didFetch = true
        }
    }
    
    const completeOrder = async (id) => {
        try {
            showAlertLoading('Completando Pedido', 'Por favor, espere...', 'info')
            const mod = await ModifyData(`${URL}/orders/complete`, { by: id })
            if (mod.success) {
                showAlert('Éxito', 'Pedido completado correctamente', 'success')
                GetOrderDetails()
            }
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
        
    }
    
    const Deactivate = async (id) => {
        const option = showAlertSelect('Cancelar pedido','¿Desea cancelar el pedido?','question')
        if ((await option).isConfirmed) {
            try {
                showAlertLoading('Cancelando Pedido', 'Por favor, espere...', 'info')
                const mod = await ModifyData(`${URL}/orders/cancel`, { by: id })
                if (mod.success) {
                    showAlert('Éxito', 'Pedido cancelado correctamente', 'success')
                    setTimeout(() => navigate("/admin/orders"),2000)
                }   
            } catch (err) {
                const message = errorStatusHandler(err)
                showAlert('Error', message, 'error')
            }
        }
    }

    // Effects 
    useEffect(() => {
        if (id_ped) { 
            GetOrderDetails() 
        }
    }, [id_ped])

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
        return new Date(dateString).toLocaleDateString('es-ES', options)
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'PENDIENTE': return styles.statusPending
            case 'PROCESANDO': return styles.statusProcessing
            case 'ENVIADO': return styles.statusShipped
            case 'ENTREGADO':
            case 'COMPLETED':
                return styles.statusCompleted
            case 'CANCELADO': return styles.statusCancelled
            default: return ''
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDIENTE': return <Clock />
            case 'PROCESANDO': return <RefreshCw />
            case 'ENVIADO': return <Truck />
            case 'ENTREGADO':
            case 'COMPLETED':
                return <Check />
            case 'CANCELADO': return <PinOff />
            default: return ''
        }
    }

    if (!order && !loading) {
        return (
            <div className={styles.notFoundState}>
                <h2>Pedido no encontrado</h2>
                <p>No se encontró el pedido con ID #{id_ped}</p>
                <Link to="/admin/orders" className={styles.backButton}>
                    Volver a pedidos
                </Link>
            </div>
        )
    }

    return (
        <main className={styles.mainContent}>
            {loading? (
                <AdminLoadingScreen message='Cargando detalles del pedido' />
            ):(
                <div className={styles.content}>
                    <header className={styles.header}>
                        <div>
                            <h1>Detalles de pedido: #{order?.id_ped}</h1>
                            <div className={styles.orderDate}>
                                <Calendar />
                                {formatDate(order?.fec_ped || '0000-00-00')}
                            </div>
                        </div>
                        <nav
                            style={{ display: 'flex',gap: '1rem' }}
                        >
                            {order?.sta_ped === 'PENDIENTE' && (
                                <button
                                    className='backButton'
                                    onClick={() => completeOrder(id_ped)}
                                >
                                    <PackageCheck />
                                    Completar Pedido
                                </button>
                            )}
                            {order?.sta_ped !== 'ENTREGADO' && (
                                <button
                                    className='deleteButton'
                                    onClick={() => Deactivate(id_ped)}
                                >
                                    <Trash2 />
                                    Cancelar
                                </button>
                            )}
                            <Link to="/admin/orders" className='backButton'>
                                <ChevronLeft />
                                Atrás
                            </Link>
                        </nav>
                    </header>

                    <div className={styles.statusSection}>
                        <h2>Estado del pedido:</h2>
                        <div className={`${styles.statusBadge} ${getStatusBadgeClass(order?.sta_ped)}`}>
                            {getStatusIcon(order?.sta_ped)} {order?.sta_ped}
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    <section className={styles.section}>
                        <h2>Dirección de facturación</h2>
                        <div className={styles.addressDetails}>
                            <strong>{order?.nom_per} {order?.ape_per}</strong><br />
                            {order?.dir_env_ped?.split(',')?.map((line, i) => (
                                <span key={i}>{line.trim()}<br /></span>
                            ))}
                            <br />
                            <strong>Email:</strong> <a href={`mailto:${order?.email_per}`}>{order?.email_per}</a><br />
                            <strong>Celular:</strong> <a href={`tel:${order?.cel_per}`}>{order?.cel_per}</a>
                        </div>
                    </section>

                    <hr className={styles.divider} />

                    <section className={styles.section}>
                        <h2>Dirección de envío</h2>
                        <div className={styles.addressDetails}>
                            <strong>{order?.nom_per} {order?.ape_per}</strong><br />
                            {order?.dir_env_ped?.split(',')?.map((line, i) => (
                                <span key={i}>{line.trim()}<br /></span>
                            ))}
                            <br />
                            <strong>Método de envío:</strong> {order?.nom_met_env}
                        </div>
                    </section>

                    <hr className={styles.divider} />

                    <section className={styles.section}>
                        <h2>Método de pago</h2>
                        <div className={styles.paymentDetails}>
                            <strong>{order?.nom_met_pag}</strong><br />
                            <strong>Titular:</strong> {order?.nom_per} {order?.ape_per}<br />
                        </div>
                    </section>

                    <hr className={styles.divider} />

                    <section className={styles.section}>
                        <h2>Productos del pedido</h2>
                        
                        <div className={styles.productsSection}>
                            {order?.products?.map((product, index) => (
                                <div key={index} className={styles.productItem}>
                                    <span className={styles.productHeader}>
                                        <h3 className={styles.productName}>
                                            <Package />
                                            {product.nom_pro} ({product.nom_col})
                                        </h3>
                                        {/* {console.log(product)} */}
                                        <button 
                                            onClick={() => setImgExpand(product.url_img)}
                                            className={styles.inactiveImg}
                                            style={{ borderColor: product.hex_col }}
                                        >
                                            <CheckImage
                                                src={product.url_img}
                                                imgDefault={imgDefault}
                                                alt={product.des_pro}
                                            />
                                        </button>
                                    </span>
                                    {product.des_pro?.split('\n').map((line, i) => (
                                        <p key={i} className={styles.productDescription}>{line}</p>
                                    ))}

                                    <table className={styles.quantityTable}>
                                        <thead>
                                            <tr>
                                                <th>Cantidad</th>
                                                <th>Precio unitario</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{product.can_pro_ped}</td>
                                                <td>${formatNumber(Number(product?.pre_pro) || 0)}</td>
                                                <td>${formatNumber(product?.pre_pro * product?.can_pro_ped || 0)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    </section>

                    <hr className={styles.divider} />

                    <section className={styles.section}>
                        <h2>Resumen de pago</h2>
                        <div className={styles.totalsSection}>
                            <div className={styles.totalRow}>
                                <span>Subtotal:</span>
                                <span>${formatNumber(order?.subtotal_ped || 0)}</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Costo Envio:</span>
                                <span>${formatNumber(order?.pre_met_env || 0)}</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Impuestos ({order?.impuestos ? Math.round((order.impuestos / order.subtotal_ped) * 100) : 0}%):</span>
                                <span>${formatNumber(order?.impuestos || 0)}</span>
                            </div>
                            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                                <span>Total:</span>
                                <span>${formatNumber((order?.subtotal_ped + (order.pre_met_env || 0)) || 0)}</span>
                            </div>
                        </div>
                    </section>

                    {/* <div className={styles.actions}>
                        <button className={styles.printButton}>
                            <Printer />
                            Imprimir factura
                        </button>
                        <button className={styles.emailButton}>
                            <Mail />
                            Enviar por email
                        </button>
                    </div> */}
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
                </div>
            )}
        </main>
    )
}