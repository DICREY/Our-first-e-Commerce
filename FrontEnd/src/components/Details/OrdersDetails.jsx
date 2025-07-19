// Librarys 
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Imports 
import { PostData } from '../../Utils/Requests'
import { errorStatusHandler, formatNumber } from '../../Utils/utils'

// Import styles 
import styles from '../../styles/Details/OrderDetail.module.css'

// Component 
export const OrderDetail = ({ URL = '', id_ped = null }) => {
    // Dynamic vars
    const [ order, setOrder ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)

    // Functions 
    const GetOrderDetails = async () => {
        try {
            const got = await PostData(`${URL}/orders/by`, {by: id_ped})
            console.log(got[0])
            setLoading(false)
            if (got && got[0]) {
                setOrder(got[0])
            }
        } catch (err) {
            setLoading(false)
            const message = errorStatusHandler(err)
        }
    }

    // Effects 
    useEffect(() => {
        if (id_ped) { GetOrderDetails() }
    }, [])

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
        return new Date(dateString).toLocaleDateString('en-US', options)
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

    if (loading) {
        return <div className={styles.loading}>Loading order details...</div>
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>
    }

    if (!order) {
        return <div className={styles.notFound}>Order not found</div>
    }

    return (
        <main className={styles.mainContent}>
            <header className={styles.header}>
                <h1>Order Details: #{order?.id_ped}</h1>
                <div className={styles.orderDate}>{formatDate(order?.fec_ped)}</div>

                <Link to="/admin/orders" className={styles.backButton}>
                    &larr Back to Orders
                </Link>
            </header>

            <div className={styles.statusSection}>
                <h2>Status:</h2>
                <div className={`${styles.statusBadge} ${getStatusBadgeClass(order?.sta_ped)}`}>
                    {order?.sta_ped}
                </div>
            </div>

            <div className={styles.divider}></div>

            <section className={styles.section}>
                <h2>Billing Address</h2>
                <div className={styles.addressDetails}>
                    <strong>{order?.nom_per} {order?.ape_per}</strong><br />
                    {order?.dir_env_ped?.split(',').map((line, i) => (
                        <span key={i}>{line.trim()}<br /></span>
                    ))}
                    Email: <a href={`mailto:${order?.email_per}`}>{order?.email_per}</a><br />
                    Phone: <a href={`tel:${order?.cel_per}`}>{order?.cel_per}</a>
                </div>
            </section>

            <div className={styles.divider}></div>

            <section className={styles.section}>
                <h2>Shipping Address</h2>
                <div className={styles.addressDetails}>
                    <strong>{order?.nom_per} {order?.ape_per}</strong><br />
                    {order?.dir_env_ped.split(',').map((line, i) => (
                        <span key={i}>{line.trim()}<br /></span>
                    ))}
                    <em>({order?.metodo_envio})</em>
                </div>
            </section>

            <div className={styles.divider}></div>

            <section className={styles.section}>
                <h2>Payment Method</h2>
                <div className={styles.paymentDetails}>
                    <strong>{order?.nom_met_pag}</strong><br />
                    {order?.nom_per} {order?.ape_per}<br />
                    
                </div>
            </section>

            <div className={styles.divider}></div>

            <div className={styles.productsSection}>
                <h2>Products</h2>

                {order?.products?.map((product, index) => (
                    <div key={index} className={styles.productItem}>
                        <h3 className={styles.productName}>{product.nom_pro}</h3>
                        {product.des_pro.split('\n').map((line, i) => (
                            <p key={i} className={styles.productDescription}>{line}</p>
                        ))}

                        <table className={styles.quantityTable}>
                            <thead>
                                <tr>
                                    <th>Quantity</th>
                                    <th>Rate</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{product.can_pro_ped}</td>
                                    <td>${product.subtotal}</td>
                                    <td>${formatNumber(Number(product.pre_pro))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            <div className={styles.divider}></div>

            <div className={styles.totalsSection}>
                <div className={styles.totalRow}>
                    <span>Subtotal:</span>
                    <span>${order?.subtotal}</span>
                </div>
                <div className={styles.totalRow}>
                    <span>Tax {order?.impuestos / order?.subtotal * 100}%:</span>
                    <span>${order?.impuestos}</span>
                </div>
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                    <span>Total:</span>
                    <span>${order?.total}</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.printButton}>Print Invoice</button>
                <button className={styles.emailButton}>Email Invoice</button>
            </div>
        </main>
    )
}