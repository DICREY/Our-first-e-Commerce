// Librarys 
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Box, ChartNoAxesCombined, Package, Settings, Users } from 'lucide-react'

// Import styles 
import styles from '../../styles/Admin/Dashboard.module.css'

// Component 
export const NavAdmin = () => {
    // Dynamic vars 
    const [sidebarOpen, setSidebarOpen] = useState(true)

    // Functions 
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return  (    
        <aside className = {`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
            <div className={styles.sidebarHeader}>
                <h2>Panel Admin</h2>
                <button onClick={toggleSidebar} className={styles.toggleButton}>
                    {sidebarOpen ? <ArrowLeft /> : <ArrowRight />}
                </button>
            </div>

            <nav className={styles.navMenu}>
                <ul>
                    <li>
                        <NavLink to="/admin/home">
                            <ChartNoAxesCombined className={styles.icon} />
                            {sidebarOpen && <span>Dashboard</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/products">
                            <Box className={styles.icon} />
                            {sidebarOpen && <span>Productos</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/orders">
                            <Package className={styles.icon} />
                            {sidebarOpen && <span>Pedidos</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="#">
                            <Users className={styles.icon} />
                            {sidebarOpen && <span>Clientes</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="#">
                            <Settings className={styles.icon} />
                            {sidebarOpen && <span>Configuración</span>}
                        </NavLink>
                    </li>
                </ul>
            </nav>
      </aside>
    )
}