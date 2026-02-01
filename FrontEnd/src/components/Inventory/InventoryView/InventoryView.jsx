// Libraries 
import React, { useEffect, useState } from 'react'
import { Eye, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Imports 
import { errorStatusHandler, formatDate, formatNumber, showAlert } from '../../../Utils/utils'
import { GetData } from '../../../Utils/Requests'

// Styles
import styles from './InventoryView.module.css'

// Component 
const InventoryView = ({ URL }) => {
    const [inventory, setInventory] = useState([])
    const [filteredInventory, setFilteredInventory] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterOption, setFilterOption] = useState('all')

    // Vars 
    const inventoryURL = `${URL}/inventory`
    const navigate = useNavigate()

    // Functions 
    // Filter inventory
    const handleFilter = (option) => {
        setFilterOption(option)
        let filtered = inventory

        if (option === 'low-stock') {
            filtered = inventory.filter(item => item.cantidad < 10)
        } else if (option === 'out-of-stock') {
            filtered = inventory.filter(item => item.cantidad === 0)
        } else if (option === 'in-stock') {
            filtered = inventory.filter(item => item.cantidad > 0)
        }

        setFilteredInventory(filtered)
    }

    // Search inventory
    const handleSearch = (term) => {
        setSearchTerm(term)
        const filtered = inventory.filter(item =>
            item.nom_pro?.toLowerCase().includes(term.toLowerCase()) ||
            item.nom_col?.toLowerCase().includes(term.toLowerCase()) ||
            item.nom_tal_pro?.toLowerCase().includes(term.toLowerCase())
        )
        setFilteredInventory(filtered)
    }

    // Calculate totals
    const totalItems = filteredInventory.reduce((sum, item) => sum + (item.cantidad || 0), 0)
    const lowStockCount = filteredInventory.filter(item => item.cantidad < 10 && item.cantidad > 0).length
    const outOfStockCount = filteredInventory.filter(item => item.cantidad === 0).length

    useEffect(() => {
        // Fetch existing inventory from backend
        const fetchInventory = async () => {
            try {
                const get = await GetData(`${inventoryURL}/all`)
                if (get?.success) {
                    setInventory(get?.result || [])
                    setFilteredInventory(get?.result || [])
                }
            } catch (err) {
                const message = errorStatusHandler(err)
                showAlert('Error', message, 'error')
            }
        }

        fetchInventory()
    }, [inventoryURL])

    return (
        <div className={styles.content}>
            {/* Summary Stats */}
            <div className={styles.summaryStats}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Total Artículos</span>
                    <strong className={styles.statValue}>{totalItems}</strong>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Stock Bajo</span>
                    <strong className={`${styles.statValue} ${styles.warning}`}>{lowStockCount}</strong>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Agotados</span>
                    <strong className={`${styles.statValue} ${styles.danger}`}>{outOfStockCount}</strong>
                </div>
            </div>
            
            {/* Inventory View Section */}
            <div className={styles.tableSection}>
                {/* Search and Filter Bar */}
                <div className={styles.controlsBar}>
                    <input
                        type="text"
                        placeholder="Buscar por producto, color o talla..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                    <div className={styles.filterButtons}>
                        <button
                            className={`${styles.filterBtn} ${filterOption === 'all' ? styles.active : ''}`}
                            onClick={() => handleFilter('all')}
                        >
                            Todos ({inventory.length})
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filterOption === 'in-stock' ? styles.active : ''}`}
                            onClick={() => handleFilter('in-stock')}
                        >
                            En Stock ({inventory.filter(i => i.cantidad > 0).length})
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filterOption === 'low-stock' ? styles.active : ''}`}
                            onClick={() => handleFilter('low-stock')}
                        >
                            Stock Bajo ({inventory.filter(i => i.cantidad < 10 && i.cantidad > 0).length})
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filterOption === 'out-of-stock' ? styles.active : ''}`}
                            onClick={() => handleFilter('out-of-stock')}
                        >
                            Agotado ({inventory.filter(i => i.cantidad === 0).length})
                        </button>
                    </div>
                </div>

                {filteredInventory.length > 0 ? (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Color</th>
                                    <th>Talla</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Valor Total</th>
                                    <th>Última Actualización</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInventory.map(item => {
                                    const stockStatus = item.cantidad === 0 ? 'agotado' : item.cantidad < 10 ? 'bajo' : 'disponible'
                                    const valorTotal = (item.cantidad || 0) * (item.pre_pro || 0)

                                    return (
                                        <tr 
                                            key={item.id_inv}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/product/${item.id_pro}`)}
                                        >
                                            <td className={styles.productName}>{item.nom_pro}</td>
                                            <td>
                                                <span
                                                    className={styles.badge}
                                                    style={{
                                                        backgroundColor: item.hex_col || '#ccc',
                                                        color: item.hex_col ? '#fff' : '#000'
                                                    }}
                                                >
                                                    {item.nom_col}
                                                </span>
                                            </td>
                                            <td className={styles.centered}>{item.nom_tal_pro}</td>
                                            <td className={styles.centered}>
                                                <span className={`${styles.quantity} ${styles[stockStatus]}`}>
                                                    {item.cantidad}
                                                </span>
                                            </td>
                                            <td>${formatNumber(item.pre_pro)}</td>
                                            <td className={styles.bold}>${formatNumber(valorTotal)}</td>
                                            <td className={styles.centered}>
                                                {formatDate(item.updated_at)}
                                            </td>
                                            <td className={styles.centered}>
                                                {stockStatus === 'agotado' && (
                                                    <div className={styles.statusBadge}>
                                                        <AlertCircle size={16} />
                                                        Agotado
                                                    </div>
                                                )}
                                                {stockStatus === 'bajo' && (
                                                    <div className={styles.statusBadgeLow}>
                                                        <AlertCircle size={16} />
                                                        Stock Bajo
                                                    </div>
                                                )}
                                                {stockStatus === 'disponible' && (
                                                    <div className={styles.statusBadgeAvailable}>
                                                        <Eye size={16} />
                                                        Disponible
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <AlertCircle size={48} />
                        <p>No hay productos en el inventario.</p>
                        <p>Comienza agregando productos a tu inventario.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InventoryView
