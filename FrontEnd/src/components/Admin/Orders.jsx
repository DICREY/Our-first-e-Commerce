// Librarys
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Import styles
import styles from '../../styles/Admin/OrdersList.module.css'
import { NavAdmin } from '../Navs/NavAdmin'

// Component 
export const OrdersList = ({ URL = '' }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10

  useEffect(() => {
    // Simular obtención de datos de la API
    const fetchData = async () => {
      try {
        // Datos simulados basados en tu estructura de base de datos
        const simulatedOrders = [
          {
            id_ped: 181,
            cliente: {
              id_per: 1,
              nom_per: 'Ricky',
              ape_per: 'Antony',
              email_per: 'ricky@example.com'
            },
            fec_ped: '2019-04-20',
            dir_env_ped: '2392 Main Avenue, Penasauka, New Jersey 02149',
            metodo_envio: 'Flat Rate',
            sta_ped: 'ENTREGADO',
            total: 1250.75
          },
          {
            id_ped: 182,
            cliente: {
              id_per: 2,
              nom_per: 'Kin',
              ape_per: 'Rossow',
              email_per: 'kin@example.com'
            },
            fec_ped: '2019-04-20',
            dir_env_ped: '1 Hollywood Blvd, Beverly Hills, California 90210',
            metodo_envio: 'Free Shipping',
            sta_ped: 'ENVIADO',
            total: 899.99
          },
          // Más pedidos simulados...
        ]
        
        setOrders(simulatedOrders)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching orders:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredOrders = orders.filter(order => {
    // Filtrar por término de búsqueda
    const matchesSearch = 
      `#${order.id_ped}`.includes(searchTerm) ||
      `${order.cliente.nom_per} ${order.cliente.ape_per}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cliente.email_per.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filtrar por estado
    const matchesStatus = statusFilter === 'all' || order.sta_ped === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Paginación
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-GB', options)
  }

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'PENDIENTE': return styles.statusPending
      case 'PROCESANDO': return styles.statusProcessing
      case 'ENVIADO': return styles.statusShipped
      case 'ENTREGADO': return styles.statusDelivered
      case 'CANCELADO': return styles.statusCancelled
      default: return ''
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading orders...</div>
  }

  return (
    <main className={styles.ordersMainContainer}>
        <NavAdmin />
        <main className={styles.ordersContainer}>
        <div className={styles.header}>
            <h1>Orders</h1>
            <div className={styles.controls}>
            <div className={styles.searchBox}>
                <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                />
                <span className={styles.searchIcon}>🔍</span>
            </div>
            
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.statusFilter}
            >
                <option value="all">All Status</option>
                <option value="PENDIENTE">Pending</option>
                <option value="PROCESANDO">Processing</option>
                <option value="ENVIADO">Shipped</option>
                <option value="ENTREGADO">Delivered</option>
                <option value="CANCELADO">Cancelled</option>
            </select>
            </div>
        </div>

        <div className={styles.ordersTable}>
            <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Order</div>
            <div className={styles.headerCell}>Date</div>
            <div className={styles.headerCell}>Customer</div>
            <div className={styles.headerCell}>Status</div>
            <div className={styles.headerCell}>Total</div>
            <div className={styles.headerCell}>Actions</div>
            </div>

            {currentOrders.length > 0 ? (
            currentOrders.map(order => (
                <div key={order.id_ped} className={styles.orderRow}>
                <div className={styles.orderCell}>
                    <div className={styles.orderId}>#{order.id_ped}</div>
                    <div className={styles.orderCustomerEmail}>{order.cliente.email_per}</div>
                </div>
                
                <div className={styles.orderCell}>
                    {formatDate(order.fec_ped)}
                </div>
                
                <div className={styles.orderCell}>
                    <div className={styles.customerName}>
                    {order.cliente.nom_per} {order.cliente.ape_per}
                    </div>
                    <div className={styles.shippingAddress}>
                    {order.dir_env_ped} Via {order.metodo_envio}
                    </div>
                </div>
                
                <div className={styles.orderCell}>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.sta_ped)}`}>
                    {order.sta_ped}
                    </span>
                </div>
                
                <div className={styles.orderCell}>
                    ${order.total.toFixed(2)}
                </div>
                
                <div className={styles.orderCell}>
                    <Link 
                    to={`/orders/${order.id_ped}`} 
                    className={styles.viewButton}
                    >
                    View
                    </Link>
                </div>
                </div>
            ))
            ) : (
            <div className={styles.noResults}>
                No orders found matching your criteria.
            </div>
            )}
        </div>

        {filteredOrders.length > ordersPerPage && (
            <div className={styles.pagination}>
            <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.paginationButton}
            >
                Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`${styles.paginationButton} ${currentPage === page ? styles.active : ''}`}
                >
                {page}
                </button>
            ))}
            
            <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
            >
                Next
            </button>
            </div>
        )}
        </main>
    </main>
  )
}