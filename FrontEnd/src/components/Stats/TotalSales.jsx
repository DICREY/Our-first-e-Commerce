// Librarys 
import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

// Imports 
import { errorStatusHandler, formatNumber, PriceCompare, showAlert } from '../../Utils/utils'
import { GetData } from '../../Utils/Requests'

// Import styles 
import styles from '../../styles/Admin/TotalSales.module.css'
import { TagInfo } from '../TagInfo/TagInfo'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Component
export const TotalSales = ({ URL = '' }) => {
    const [dailySales, setDailySales] = useState(null)
    const [salesSummary, setSalesSummary] = useState(null)
    const [loading, setLoading] = useState(true)

    const GetDailySales = async () => {
        try {
            const got = await GetData(`${URL}/stats/sales-per-day`)
            setLoading(false)
            if (got) {
                setDailySales(got)
            }
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }
    
    const GetInfo = async () => {
        try {
            const got = await GetData(`${URL}/stats/sales-summary`)
            setLoading(false)
            if (got && got[0]) {
                const compareMonth = PriceCompare(got[0]?.month_previous,got[0]?.month_current)
                const compareYear = PriceCompare(got[0]?.year_previous,got[0]?.year_current)
                setSalesSummary({
                    ...got[0],
                    compareMonths: compareMonth,
                    compareYears: compareYear
                })
            }
        } catch (err) {
            setLoading(false)
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }

    useEffect(() => {
        GetDailySales()
        GetInfo()
    }, [])

    const chartData = {
        labels: dailySales?.map(item => item.day) || [],
        datasets: [
            {
                label: 'Daily Sales ($)',
                data: dailySales?.map(item => item.value),
                borderColor: 'var(--accent-600)',
                backgroundColor: 'rgba(131, 70, 229, 0.1)',
                pointBackgroundColor: 'var(--accent-600)',
                pointBorderColor: 'var(--white)',
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'var(--accent-600)',
                pointHoverBorderColor: 'var(--white)',
                pointHitRadius: 10,
                pointBorderWidth: 2,
                borderWidth: 2,
                borderRadius: 6,
                pointRadius: 0,
                tension: 0.4,
                fill: true,
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `$${context.parsed.y.toLocaleString()}`
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return `$${value / 1000}k`
                    }
                },
                grid: {
                    drawBorder: false
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        maintainAspectRatio: false
    }

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Cargando datos de ventas...</p>
            </div>
        )
    }

    return (
        <div className={styles.totalSalesContainer}>
            <div className={styles.totalSalesCard}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Análisis de Ventas</h2>
                    <div className={styles.timeRange}>
                        <span className={styles.activeRange}>Últimos días</span>
                    </div>
                </div>

                <div className={styles.summaryGrid}>
                    <TagInfo 
                        borderColor='var(--success-500)'
                        label='Mes Actual'
                        value={`$${formatNumber(salesSummary?.month_current)}`}
                        lastLabel={'vs mes anterior'}
                        compareDireccion={salesSummary?.compareMonths?.direccion}
                        compareDiferencia={salesSummary?.compareMonths?.diferencia}
                    />
                    <TagInfo 
                        borderColor='var(--primary-600)'
                        label='Año Actual'
                        value={`$${formatNumber(salesSummary?.year_current)}`}
                        lastLabel={'vs año anterior'}
                        compareDireccion={salesSummary?.compareYears?.direccion}
                        compareDiferencia={salesSummary?.compareYears?.diferencia}
                    />
                </div>

                <div className={styles.chartContainer}>
                    <Line data={chartData} options={chartOptions} />
                </div>

                <div className={styles.statsFooter}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Mejor día:</span>
                        <span className={styles.statValue}>
                            {dailySales?.reduce((max, day) => max.value > day.value ? max : day, {value: 0})?.day || 'N/A'}
                        </span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Ventas promedio:</span>
                        <span className={styles.statValue}>
                            ${dailySales?.length ? formatNumber(Math.round(dailySales.reduce((sum, day) => sum + day.value, 0) / dailySales.length)) : '0'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}