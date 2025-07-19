// Librarys 
import { useEffect, useState } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js'

// Imports
import { divideList, errorStatusHandler, formatNumber, PriceCompare } from '../../Utils/utils'
import { GetData } from '../../Utils/Requests'

// Import styles 
import styles from '../../styles/Admin/stats.module.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

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
            borderColor: 'var(--secondary-color)',
            backgroundColor: 'rgba(167, 199, 231, 0.3)',
            tension: 0.4,
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

// Component MarketShare
export const MarketShare = ({ URL = '' }) => {
    // Dynamic vars 
    const [ almcData, setAlmcData ] = useState()
    
    // Vars
    let didFetch = false
    const data = {
        labels: ['Falcon', 'Sparrow', 'Phoenix'],
        datasets: [
            {
                data: [57, 20, 22],
                backgroundColor: [
                    'var(--primary-color)',
                    'var(--secondary-color)',
                    'rgba(167, 199, 231, 0.7)',
                ],
                borderWidth: 0,
            },
        ],
    }

    const options = {
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                },
            },
        },
    }

    // Functions 
    const GetInfo = async () => {
        if (didFetch) return
        try {
            const got = await GetData(`${URL}`)
            didFetch = true
            if (got) {
                setAlmcData(got)
            }
        } catch (err) {
            const message = errorStatusHandler(err)
        }
    }

    useEffect(() => {
        GetInfo()
    },[])

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Market Share</h3>
            <div className={styles.chartWrapper}>
                <div className={styles.doughnutContainer}>
                    <Doughnut data={data} options={options} />
                    <div className={styles.centerText}>26M</div>
                </div>
                <div className={styles.legend}>
                    <p>Falcon: 57%</p>
                    <p>Sparrow: 20%</p>
                    <p>Phoenix: 22%</p>
                </div>
            </div>
        </div>
    )
}

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
                backgroundColor: 'var(--secondary-color)',
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