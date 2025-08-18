// Librarys 
import { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'

// Imports
import { errorStatusHandler } from '../../../Utils/utils'
import { GetData } from '../../../Utils/Requests'

// Import styles 
import styles from '../../../styles/Admin/stats.module.css'

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