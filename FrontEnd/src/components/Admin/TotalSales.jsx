// Librarys 
import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

// Imports 
import { errorStatusHandler, formatNumber, PriceCompare } from '../../Utils/utils'
import { GetData } from '../../Utils/Requests'

// Import styles 
import styles from '../../styles/Admin/TotalSales.module.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

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
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(131, 70, 229, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#8346e5ff',
                pointBorderColor: 'var(--white)',
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#4f46e5',
                pointHoverBorderColor: 'var(--white)',
                pointHitRadius: 10,
                pointBorderWidth: 2,
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
                    <div className={styles.summaryCard} style={{ borderLeftColor: 'var(--success-500)' }}>
                        <span className={styles.summaryLabel}>Mes Actual</span>
                        <span className={styles.summaryValue}>${formatNumber(salesSummary?.month_current)}</span>
                        <div className={styles.comparison}>
                            <span className={styles.comparisonValue}>
                                {salesSummary?.compareMonths?.direccion} {salesSummary?.compareMonths?.diferencia}
                            </span>
                            <span className={styles.comparisonLabel}>vs mes anterior</span>
                        </div>
                    </div>

                    <div className={styles.summaryCard} style={{ borderLeftColor: '#8fb4ff' }}>
                        <span className={styles.summaryLabel}>Año Actual</span>
                        <span className={styles.summaryValue}>${formatNumber(salesSummary?.year_current)}</span>
                        <div className={styles.comparison}>
                            <span className={styles.comparisonValue}>
                                {salesSummary?.compareYears?.direccion} {salesSummary?.compareYears?.diferencia}
                            </span>
                            <span className={styles.comparisonLabel}>vs año anterior</span>
                        </div>
                    </div>
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