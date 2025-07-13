// Librarys 
import React, { useState, useEffect, useContext } from 'react'

// Imports 
import { AuthContext } from '../../Contexts/Contexts'
import { Greeting } from '../../Utils/utils'

// Import styles 
import styles from '../../styles/Admin/DailySummary.module.css'

// Component 
export const DailySummary = ({ URL = '' }) => {
    // Dynamic vars
    const [storeData, setStoreData] = useState({
        visits: 0,
        sales: 0,
        unpublishedProducts: 0,
        pendingPayments: 0,
        unfulfilledOrders: 0
    })
    const [loading, setLoading] = useState(true)
    const [currentTime, setCurrentTime] = useState('')

    // Vars 
    const { user } = useContext(AuthContext)

    useEffect(() => {
        // Simular obtención de datos de la API
        const fetchData = async () => {
            try {
                // En una implementación real, harías llamadas a tu API aquí
                // Ejemplo:
                // const response = await fetch(`/api/dashboard?userId=${userId}`)
                // const data = await response.json()

                // Datos simulados basados en tu estructura de base de datos
                const today = new Date().toISOString().split('T')[0]
                const simulatedData = {
                    visits: 14209, // De la tabla sessions/page_views
                    sales: 21349.29, // Suma de subtotales en detalle_pedidos para hoy
                    unpublishedProducts: 5, // Productos con sta_pro=1 pero no en Facebook
                    pendingPayments: 7, // Pedidos con sta_ped='PENDIENTE'
                    unfulfilledOrders: 50 // Pedidos con sta_ped='PROCESANDO'
                }

                setStoreData(simulatedData)
                setLoading(false)

                // Actualizar la hora actual
                const now = new Date()
                setCurrentTime(`${now.toLocaleTimeString()}`)
            } catch (error) {
                console.error('Error fetching data:', error)
                setLoading(false)
            }
        }

        fetchData()

        // Actualizar la hora cada minuto
        const timer = setInterval(() => {
            const now = new Date()
            setCurrentTime(`${now.toLocaleTimeString()}`)
        }, 30000)

        return () => clearInterval(timer)
    }, [])

    if (loading) {
        return <div className={styles.loading}>Loading dashboard data...</div>
    }

    return (
        <article className={styles.dailySummaryContainer}>
            <aside className={styles.dailySummary}>
                <header className={styles.header}>
                    <span className={styles.headerDiv}>
                        <h2>{Greeting()}, {user.names} {user.lastNames}!</h2>
                        <h2>{currentTime}</h2>
                    </span>
                    <p>Aquí vemos lo que sucede en tu tienda</p>
                </header>

                <main className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <h3>Today's visits</h3>
                        <p className={styles.statValue}>{storeData.visits.toLocaleString()}</p>
                    </div>

                    <div className={styles.statCard}>
                        <h3>Today's total sales</h3>
                        <p className={styles.statValue}>${storeData.sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </main>

                <article className={styles.alerts}>
                    <div className={styles.alertItem}>
                        <span className={styles.alertBadge}>{storeData.unpublishedProducts}</span>
                        <span>products didn't publish to your Facebook page</span>
                        <a href="/admin/products" className={styles.alertLink}>View products &gt</a>
                    </div>

                    <div className={styles.alertItem}>
                        <span className={styles.alertBadge}>{storeData.pendingPayments}</span>
                        <span>orders have payments that need to be captured</span>
                        <a href="/admin/payments" className={styles.alertLink}>View payments &gt</a>
                    </div>

                    <div className={styles.alertItem}>
                        <span className={styles.alertBadge}>{storeData.unfulfilledOrders}+</span>
                        <span>orders need to be fulfilled</span>
                        <a href="/admin/orders" className={styles.alertLink}>View orders &gt</a>
                    </div>
                </article>
            </aside>
        </article>
    )
}