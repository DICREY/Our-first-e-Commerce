// Librarys 
import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

// Imports 
import { errorStatusHandler } from '../../Utils/utils'
import { GetData } from '../../Utils/Requests'

// Import styles 
import styles from '../../styles/Admin/TotalSales.module.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Component 
export const TotalSales = ({ URL = '' }) => {
    const [dailySales, setDailySales] = useState(null)
    const [years, setYears] = useState(null)

    const GetDailySales = async () => {
        try {
            const got = await GetData(`${URL}/stats/sales-per-day`)
            if (got) {
                setDailySales(got)
            }
        } catch (err) {
            const message = errorStatusHandler(err)
        }
    }

    const GetInfo = async () => {
        try {
            const got = await GetData(`${URL}/stats/last-sales`)
            if (got) {
                const prevYear = got?.map(i => i.tipo === "prev_year_sales")
                const lastMonth = got?.map(i => i.tipo === "last_month_sales")
                setYears({
                    prevYear: prevYear,
                    lastMonth: lastMonth
                })
            }
        } catch (err) {
            const message = errorStatusHandler(err)
        }
    }

    useEffect(() => {
        GetDailySales()
        GetInfo()
    }, [])

    // Preparar datos para el gráfico
    const chartData = {
        labels: dailySales?.map(item => item.day),
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

    return (
        <article className={styles.totalSalesContainer}>
            <aside className={styles.totalSales}>
                <h2 className={styles.title}>Ventas Totales</h2>

                <header className={styles.summary}>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Mes pasado:</span>
                        <span className={styles.summaryValue}>${years?.lastMonth?.value || 0}</span>
                    </div>

                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Año anterior:</span>
                        <span className={styles.summaryValue}>${years?.prevYear?.value || 0}</span>
                    </div>
                </header>

                <hr className={styles.divider} />

                <main className={styles.chartContainer}>
                    <Line
                        data={chartData}
                        options={chartOptions}
                    />
                </main>
            </aside>
        </article>
    )
}