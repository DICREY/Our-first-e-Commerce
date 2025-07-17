// Librarys 
import React, { useState, useEffect, useContext } from 'react'

// Imports 
import { AuthContext } from '../../Contexts/Contexts'
import { errorStatusHandler, Greeting } from '../../Utils/utils'

// Import styles 
import styles from '../../styles/Admin/DailySummary.module.css'
import { GetData } from '../../Utils/Requests'

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
    const [currentTime, setCurrentTime] = useState()

    // Vars 
    const { user } = useContext(AuthContext)
    const now = new Date()

    // Functions 
    const GetTodaySales = async () => {
        try {
            const got = await GetData(`${URL}/stats/today-sales`)
            if (got) {
                setStoreData(got)
            }
        } catch (err) {
            const message = errorStatusHandler(err)
        }
    }

    useEffect(() => {
        setCurrentTime(now.toLocaleTimeString())
        GetTodaySales()
        
        // Actualizar la hora cada minuto
        const timer = setInterval(() => {
            const now = new Date()
            setCurrentTime(`${now.toLocaleTimeString()}`)
        }, 30000)

        return () => clearInterval(timer)
    }, [])

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
                        <h3>Visitas de hoy</h3>
                        <p className={styles.statValue}>{storeData?.visits || 0}</p>
                    </div>

                    <div className={styles.statCard}>
                        <h3>Vendido hoy</h3>
                        <p className={styles.statValue}>${storeData?.sales || 0}</p>
                    </div>
                </main>

                <article className={styles.alerts}>
                    <div className={styles.alertItem}>
                        <span className={styles.alertBadge}>{storeData?.unpublishedProducts}</span>
                        <span>products didn't publish to your Facebook page</span>
                        <a href="/admin/products" className={styles.alertLink}>View products &gt</a>
                    </div>

                    <div className={styles.alertItem}>
                        <span className={styles.alertBadge}>{storeData?.pendingPayments}</span>
                        <span>orders have payments that need to be captured</span>
                        <a href="/admin/payments" className={styles.alertLink}>View payments &gt</a>
                    </div>

                    <div className={styles.alertItem}>
                        <span className={styles.alertBadge}>{storeData?.unfulfilledOrders}+</span>
                        <span>orders need to be fulfilled</span>
                        <a href="/admin/orders" className={styles.alertLink}>View orders &gt</a>
                    </div>
                </article>
            </aside>
        </article>
    )
}