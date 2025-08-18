// Librarys 
import { useEffect, useState } from 'react'
import { Line, } from 'react-chartjs-2'

// Imports
import { errorStatusHandler, formatNumber, PriceCompare } from '../../../Utils/utils'
import { GetData } from '../../../Utils/Requests'

// Import styles 
import styles from '../../../styles/Admin/stats.module.css'

// Component WeeklySales
export const WeeklySales = ({ URL = '' }) => {
    // Dynamic vars 
    const [ almcData, setAlmcData ] = useState(null)
    const [ totals, setTotals ] = useState()
    const [ sales, setSales ] = useState(null)
    const [ days, setDays ] = useState()
    const [ compare, setCompare ] = useState()
    
    // Vars
    let didFetch = false
    const data = {
        labels: days || [],
        datasets: [
        {
            label: 'Ventas ($)',
            data: totals || [],
            borderColor: 'var(--accent-600)',
            backgroundColor: 'rgba(167, 199, 231, 0.3)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            borderRadius: 6,
            fill: true,
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
            callback: function(value) {
                return '$' + value / 1000 + 'K'
            }
            }
        },
        x: { grid: { display: false } }
        },
    }

    // Functions 
    const GetInfo = async () => {
        try {
            const got = await GetData(`${URL}/stats/weekly-sales`)
            if (got) {
                const day = got?.map(i => i.nombre_dia)
                const MapData = got?.map(i => i.total_vendido)
                setDays(day)
                setAlmcData(got)
                setTotals(MapData)
            }
        } catch (err) {
            const message = errorStatusHandler(err)
        }
    }

    const GetSalesSummary = async () => {
        try {
            const got = await GetData(`${URL}/stats/sales-summary`)
            if (got && got[0]) {
                setSales(got[0])
            }
            didFetch = true
        } catch (err) {
            const message = errorStatusHandler(err)
        }
    }

    useEffect(() => {
        if (didFetch) return
        GetInfo()
        GetSalesSummary()
    },[])

    useEffect(() => {
        setCompare(PriceCompare(sales?.week_previous,sales?.week_current))
    },[sales])

    return (
        <aside className={styles.card}>
            <header className={styles.header}>
                <h3 className={styles.title}>Ventas Semanales</h3>
                <div className={styles.stats}>
                <p className={styles.amount}>${formatNumber(sales?.week_current)}</p>
                <p className={styles.percentage}>{compare?.direccion} {compare?.diferencia}</p>
                </div>
            </header>
            <div className={styles.chartContainer}>
                <Line data={data} options={options} />
            </div>
        </aside>
    )
}