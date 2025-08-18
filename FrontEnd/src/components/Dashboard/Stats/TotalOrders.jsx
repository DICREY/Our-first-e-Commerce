// Librarys 
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

// Imports
import { errorStatusHandler, formatNumber, PriceCompare, showAlert } from '../../../Utils/utils'
import { GetData } from '../../../Utils/Requests'

// Import styles 
import styles from '../../../styles/Admin/stats.module.css'

// Component TotalOrders
export const TotalOrders = ({ URL = '' }) => {
    // Dynamic vars 
    const [ almcData, setAlmcData ] = useState()
    const [ months, setMonths ] = useState()
    const [ orders, setOrders ] = useState()
    const [ total, setTotal ] = useState()
    const [ lastTotal, setLastTotal ] = useState(null)
    
    // Vars
    let didFetch = false
    const data = {
        labels: months || [],
        datasets: [
            {
                label: 'Órdenes',
                data: orders || [],
                backgroundColor: 'var(--accent-600)',
                borderColor: 'var(--accent-600)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0, 
                borderRadius: 6,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: false },
                ticks: {
                    callback: function (value) {
                        return value
                    }
                }
            },
            x: { grid: { display: false } }
        },
    }

    // Functions 
    const GetInfo = async () => {
        if (didFetch) return
        try {
            const got = await GetData(`${URL}/stats/monthly-sales`)
            if (got) {
                const month = got?.map(i => i.nombre_mes)
                const order = got?.map(i => i.cantidad_pedidos)
                const MapData = got?.map(i => i.total_vendido)
                setTotal(MapData)
                setMonths(month)
                setOrders(order)
                setAlmcData(got)
            }
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }

    const GetSalesSummary = async () => {
        try {
            const got = await GetData(`${URL}/stats/sales-summary`)
            if (got && got[0]) {
                const compare = PriceCompare(got[0]?.year_previous,got[0]?.year_current)
                setLastTotal({
                    ...got[0],
                    ...compare
                })
            }
            didFetch = true
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }


    useEffect(() => {
        GetInfo()
        GetSalesSummary()
    },[])

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>Pedidos del año</h3>
                <div className={styles.stats}>
                    <p className={styles.amount}>${formatNumber(lastTotal?.year_current)}</p>
                    <p className={styles.percentage}>{lastTotal?.direccion} {lastTotal?.diferencia}</p>
                </div>
            </div>
            <div className={styles.chartContainer}>
                <Bar data={data} options={options} />
            </div>
            <div className={styles.target}>
                <p>Target: <span>55%</span></p>
            </div>
        </div>
    )
}