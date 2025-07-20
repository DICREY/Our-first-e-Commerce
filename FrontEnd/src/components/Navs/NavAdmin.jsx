// Librarys 
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { 
  ArrowLeft, 
  ArrowRight, 
  Box, 
  ChartNoAxesCombined, 
  Package, 
  Users, 
  Settings,
  Home,
  ChevronRight
} from 'lucide-react'

// Import styles 
import styles from '../../styles/Navs/NavAdmin.module.css'

// Component 
export const NavAdmin = () => {
    // Dynamic vars 
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [activeSubmenu, setActiveSubmenu] = useState(null)

    // Functions 
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
        if (!sidebarOpen) setActiveSubmenu(null)
    }

    const toggleSubmenu = (menu) => {
        setActiveSubmenu(activeSubmenu === menu ? null : menu)
    }

    const navItems = [
        {
            path: "/admin/home",
            icon: <ChartNoAxesCombined size={20} />,
            label: "Dashboard",
            exact: true
        },
        {
            path: "/admin/products",
            icon: <Box size={20} />,
            label: "Productos",
            submenu: [
                { path: "/admin/products/list", label: "Todos los productos" },
                { path: "/admin/products/categories", label: "Categorías" },
                { path: "/admin/products/inventory", label: "Inventario" }
            ]
        },
        {
            path: "/admin/orders",
            icon: <Package size={20} />,
            label: "Pedidos",
            submenu: [
                { path: "/admin/orders/pending", label: "Pendientes" },
                { path: "/admin/orders/completed", label: "Completados" },
                { path: "/admin/orders/returns", label: "Devoluciones" }
            ]
        },
        {
            path: "/admin/customers",
            icon: <Users size={20} />,
            label: "Clientes"
        },
        {
            path: "/admin/settings",
            icon: <Settings size={20} />,
            label: "Configuración",
            submenu: [
                { path: "/admin/settings/general", label: "Generales" },
                { path: "/admin/settings/users", label: "Usuarios" },
                { path: "/admin/settings/integrations", label: "Integraciones" }
            ]
        },
        {
            path: "/",
            icon: <Home size={20} />,
            label: "Volver al sitio"
        }
    ]

    return (    
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
            <div className={styles.sidebarHeader}>
                {sidebarOpen && <h2>Panel Administrativo</h2>}
                <button 
                    onClick={toggleSidebar} 
                    className={styles.toggleButton}
                    aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
                >
                    {sidebarOpen ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                </button>
            </div>

            <nav className={styles.navMenu}>
                <ul>
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <div className={styles.navItemContainer}>
                                <NavLink 
                                    to={item.path}
                                    onClick={() => toggleSubmenu(item.label)}
                                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                    end={item.exact}
                                >
                                    <span className={styles.icon}>{item.icon}</span>
                                    {sidebarOpen && (
                                        <>
                                            <span className={styles.label}>{item.label}</span>
                                            {item.submenu && (
                                                <ChevronRight 
                                                    size={16} 
                                                    className={`${styles.chevron} ${
                                                        activeSubmenu === item.label ? styles.rotated : ''
                                                    }`}
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            </div>

                            {sidebarOpen && item.submenu && activeSubmenu === item.label && (
                                <ul className={styles.submenu}>
                                    {item.submenu.map((subItem, subIndex) => (
                                        <li key={subIndex}>
                                            <NavLink 
                                                to={subItem.path}
                                                className={({ isActive }) => `${styles.submenuLink} ${isActive ? styles.active : ''}`}
                                            >
                                                {subItem.label}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}