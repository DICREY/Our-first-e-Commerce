// Librarys 
import React, { useState, useEffect, useContext } from 'react'

// Imports 
import { AuthContext } from '../../Contexts/Contexts'
import { errorStatusHandler, formatNumber, Greeting } from '../../Utils/utils'

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
            const got = await GetData(`${URL}/stats/sales-summary`)
            if (got && got[0]) {
                setStoreData(got[0])
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
            <div className={styles.dailySummary}>
                <header className={styles.header}>
                    <div className={styles.headerDiv}>
                        <div>
                            <h2>{Greeting()}, {user.names} {user.lastNames}!</h2>
                            <p>Aquí vemos lo que sucede en tu tienda</p>
                        </div>
                        <div className={styles.currentTime}>{currentTime}</div>
                    </div>
                </header>

                <div className={styles.statsRow}>
                <div className={styles.statCard} style={{ borderLeftColor: 'var(--primary-600)' }}>
                    <h3>Ventas de ayer</h3>
                    <p className={styles.statValue}>${formatNumber(storeData?.day_previous)}</p>
                </div>
                
                <div className={styles.statCard} style={{ borderLeftColor: 'var(--success-500)' }}>
                    <h3>Ventas de hoy</h3>
                    <p className={styles.statValue}>${formatNumber(storeData?.day_current)}</p>
                </div>
                </div>

                <div className={styles.alerts}>
                <div className={styles.alertItem} style={{ 
                    backgroundColor: 'var(--warning-50)',
                    borderLeftColor: 'var(--warning-500)'
                }}>
                    <span className={styles.alertBadge} style={{ backgroundColor: 'var(--warning-500)' }}>
                    {storeData?.unpublishedProducts}
                    </span>
                    <span>products didn't publish to your Facebook page</span>
                    <a href="/admin/products" className={styles.alertLink}>View products &gt;</a>
                </div>
                
                <div className={styles.alertItem} style={{ 
                    backgroundColor: 'var(--accent-50)',
                    borderLeftColor: 'var(--accent-500)'
                }}>
                    <span className={styles.alertBadge} style={{ backgroundColor: 'var(--accent-500)' }}>
                    {storeData?.pendingPayments}
                    </span>
                    <span>orders have payments that need to be captured</span>
                    <a href="/admin/payments" className={styles.alertLink}>View payments &gt;</a>
                </div>
                
                <div className={styles.alertItem} style={{ 
                    backgroundColor: 'var(--primary-50)',
                    borderLeftColor: 'var(--primary-500)'
                }}>
                    <span className={styles.alertBadge} style={{ backgroundColor: 'var(--primary-500)' }}>
                    {storeData?.unfulfilledOrders}+
                    </span>
                    <span>orders need to be fulfilled</span>
                    <a href="/admin/orders" className={styles.alertLink}>View orders &gt;</a>
                </div>
                </div>
            </div>
            </article>
    )
}