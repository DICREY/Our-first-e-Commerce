// Librarys 
import { useContext, useState } from 'react'
import { ArrowLeft, ArrowRight, Box, ChartNoAxesCombined, Package, Settings, Users } from 'lucide-react'

// Imports
import { MarketShare, SellestProducts, TotalOrders, WeeklySales } from './Stats'
import { CheckImage } from '../../Utils/utils'
import { AuthContext } from '../../Contexts/Contexts'
import { DailySummary } from './DailySummary'

// Import styles 
import styles from '../../styles/Admin/Dashboard.module.css'
import { TotalSales } from './TotalSales'

// Component
export const Dashboard = ({ URL = '', imgDefault = '' }) => {
  // Dynamic vars 
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Vars 
  const { user, img } = useContext(AuthContext)

  // Functions 
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <h2>Panel Admin</h2>
          <button onClick={toggleSidebar} className={styles.toggleButton}>
            {sidebarOpen ? <ArrowLeft /> : <ArrowRight />}
          </button>
        </div>
        
        <nav className={styles.navMenu}>
          <ul>
            <li className={styles.active}>
              <a href="#">
                <ChartNoAxesCombined className={styles.icon} />
                {sidebarOpen && <span>Dashboard</span>}
              </a>
            </li>
            <li>
              <a href="#">
                <Box className={styles.icon} />
                {sidebarOpen && <span>Productos</span>}
              </a>
            </li>
            <li>
              <a href="#">
                <Package className={styles.icon} />
                {sidebarOpen && <span>Pedidos</span>}
              </a>
            </li>
            <li>
              <a href="#">
                <Users className={styles.icon} />
                {sidebarOpen && <span>Clientes</span>}
              </a>
            </li>
            <li>
              <a href="#">
                <Settings className={styles.icon} />
                {sidebarOpen && <span>Configuración</span>}
              </a>
            </li>
          </ul>
        </nav>
      </aside>

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
    </div>
  )
}