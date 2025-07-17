// Librarys 
import { useContext } from 'react'

// Imports
import { MarketShare, SellestProducts, TotalOrders, WeeklySales } from './Stats'
import { CheckImage } from '../../Utils/utils'
import { AuthContext } from '../../Contexts/Contexts'
import { DailySummary } from './DailySummary'
import { TotalSales } from './TotalSales'
import { NavAdmin } from '../Navs/NavAdmin'

// Import styles 
import styles from '../../styles/Admin/Dashboard.module.css'

// Component
export const Dashboard = ({ URL = '', imgDefault = '' }) => {  
  // Vars 
  const { user, img } = useContext(AuthContext)

  return (
    <main className={styles.dashboardContainer}>
      <NavAdmin />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.topBar}>
          <h1>Dashboard</h1>
          <div className={styles.userInfo}>
            <span>Administrador</span>
            <CheckImage 
              alt={`${user.names} ${user.lastNames}`}
              className={styles.userAvatar}
              imgDefault={imgDefault}
              src={img}
            />
          </div>
        </header>

        <DailySummary URL={URL} />

        <div className={styles.statsGrid}>
          <WeeklySales URL={URL} />
          {/* <MarketShare URL={URL} /> */}
          <SellestProducts URL={URL} />
          <TotalOrders URL={URL} />
        </div>

        <TotalSales URL={URL} />
      </main>
    </main>
  )
}