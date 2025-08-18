// Librarys 
import { useContext } from 'react'
import {  useNavigate } from 'react-router-dom'

// Imports
import { TotalOrders } from '../../../components/Stats/TotalOrders'
import { WeeklySales } from '../../../components/Stats/WeeklySales'
import { SellestProducts } from '../../../components/Stats/SellestProducts'
import { DailySummary } from '../../../components/Stats/DailySummary/DailySummary'
import { TotalSales } from '../../../components/Stats/TotalSales'
import { AuthContext } from '../../../Contexts/Contexts'
import { CheckImage } from '../../../Utils/utils'
import { AnalyticsDashboard } from '../../../components/Stats/AnalyticsPages/AnalyticsDashboard'

// Import styles 
import styles from './Dashboard.module.css'

// Component
export const Dashboard = ({ URL = '', imgDefault = '' }) => {  
  // Vars 
  const { user, img } = useContext(AuthContext)
  const navigate = useNavigate()
  
  
  return (
    <main className={styles.mainContent}>
      <header className={styles.topBar}>
        <h1>Dashboard</h1>
        <div className={styles.userInfo}>
          <span>
            <h3>{user.names} {user.lastNames}</h3>
            (Administrador)
          </span>
          <picture 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/admin/perfil')}
          >
            <CheckImage
              alt={`${user.names} ${user.lastNames}`}
              className={styles.userAvatar}
              imgDefault={imgDefault}
              src={img}
            />
          </picture>
        </div>
      </header>

      <DailySummary URL={URL} />
      <AnalyticsDashboard />

      <div className={styles.statsGrid}>
        <WeeklySales URL={URL} />  
        <SellestProducts URL={URL} />
        <TotalOrders URL={URL} />
      </div>

      <TotalSales URL={URL} />
    </main>
  )
}