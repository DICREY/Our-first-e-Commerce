// Librarys 
import { useEffect, useState } from 'react'

// Imports
import { divideList, errorStatusHandler, formatNumber } from '../../Utils/utils'
import { GetData } from '../../Utils/Requests'

// Import styles 
import styles from '../../styles/Admin/stats.module.css'

// Component SellestProducts
export const SellestProducts = ({ URL = '' }) => {
    // Dynamic vars 
    const [ almcData, setAlmcData ] = useState()
    const [ divData, setDivData ] = useState()
    
    // Vars    
    let didFetch = false

    // Functions 
    const GetInfo = async () => {
        if (didFetch) return
        try {
            const got = await GetData(`${URL}/stats/sellest`)
            didFetch = true
            if (got) {
                setAlmcData(got)
                setDivData(divideList(got,5) || [])
            }
        } catch (err) {
            const message = errorStatusHandler(err)
        }
    }

    useEffect(() => {
        GetInfo()
    },[])

    return (
        <aside className={styles.card}>
            <h3 className={styles.title}>Productos más vendidos</h3>
            { divData && divData[0]?.map((pro, idx) => (
                <article key={idx + 1209} className={styles.content}>
                    <div className={styles.mainProduct}>
                        <div className={styles.circle}>
                            <span>{idx + 1}</span>
                        </div>
                        <div className={styles.productInfo}>
                            <p className={styles.subtitle}>Nombre</p>
                            <p className={styles.productName}>{pro.nom_pro}</p>
                        </div>
                    </div>
                    <div className={styles.others}>
                        <p className={styles.subtitle}>Vendido</p>
                        <p className={styles.ProductPercentage}>${formatNumber(pro.ingresos_generados)}/{pro.unidades_vendidas}</p>
                    </div>
                </article>
            ))}
        </aside>
    )
}