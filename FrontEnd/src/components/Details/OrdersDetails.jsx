// Librarys 
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Imports 
import { ModifyData, PostData } from '../../Utils/Requests'
import { errorStatusHandler, formatNumber } from '../../Utils/utils'

// Import styles 
import styles from '../../styles/Details/OrderDetail.module.css'
import { Calendar, Check, ChevronLeft, Clock, Mail, Package, PackageCheck, PinOff, Printer, RefreshCw, Truck } from 'lucide-react'
import AdminLoadingScreen from '../Global/Loading'

// Component 
export const OrderDetail = ({ URL = '', id_ped = null }) => {
    const [ order, setOrder ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)

    // Functions 
    const GetOrderDetails = async () => {
        try {
            const got = await PostData(`${URL}/orders/by`, {by: id_ped})
            setLoading(false)
            if (got && got[0]) {
                setOrder(got[0])
            }
        } catch (err) {
            setLoading(false)
            const message = errorStatusHandler(err)
        }
    }
    
    const completeOrder = async (id) => {
        try {
            setLoading(true)
            const mod = await ModifyData(`${URL}/orders/complete`, { by: id })
            if (mod.success) {
                setLoading(false)
                GetOrderDetails()
            }
        } catch (err) {
            setLoading(false)
            const message = errorStatusHandler(err)
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

    if (error) {
        return (
            <div className={styles.errorState}>
                <h2>Error al cargar el pedido</h2>
                <p>{error}</p>
                <Link to="/admin/orders" className={styles.backButton}>
                    Volver a pedidos
                </Link>
            </div>
        )
    }

    if (!order) {
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
            <div className={styles.content}>
                <header className={styles.header}>
                    <div>
                        <h1>Detalles de pedido: #{order?.id_ped}</h1>
                        <div className={styles.orderDate}>
                            <Calendar />
                            {formatDate(order?.fec_ped)}
                        </div>
                    </div>
                    <nav>
                        {order?.sta_ped === 'PENDIENTE' && (
                            <button
                                className={styles.backButton}
                                onClick={() => completeOrder(id_ped)}
                            >
                                <PackageCheck />
                                Completar Pedido
                            </button>
                        )}
                        <Link to="/admin/orders" className={styles.backButton}>
                            <ChevronLeft />
                            Volver a pedidos
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
                        {order?.dir_env_ped?.split(',').map((line, i) => (
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
                                <h3 className={styles.productName}>
                                    <Package />
                                    {product.nom_pro}
                                </h3>
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
                                            <td>${formatNumber(Number(product?.pre_pro))}</td>
                                            <td>${formatNumber(product?.pre_pro * product?.can_pro_ped)}</td>
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
                            <span>${formatNumber(order?.subtotal_ped)}</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Impuestos ({order?.impuestos ? Math.round((order.impuestos / order.subtotal_ped) * 100) : 0}%):</span>
                            <span>${formatNumber(order?.impuestos || 0)}</span>
                        </div>
                        <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                            <span>Total:</span>
                            <span>${formatNumber(order?.subtotal_ped)}</span>
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
            </div>
            {loading && (
                <AdminLoadingScreen message='Cargando detalles del pedido' />
            )}
        </main>
    )
}