import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  Search, Filter, Eye,
  Calendar, User, CreditCard, Truck, CheckCircle, 
  XCircle, Clock, RefreshCw, ArrowUpDown, 
  Plus
} from 'lucide-react'

// Imports 
import { GetData } from '../../Utils/Requests'
import { Paginacion } from '../Global/Paginacion'
import { divideList, errorStatusHandler, formatDate, formatNumber, searchFilter } from '../../Utils/utils'
import AdminLoadingScreen from '../Global/Loading'

// Import styles 
import styles from '../../styles/Admin/OrdersList.module.css'

// Component 
export const OrdersList = ({ URL = '', setIdOrder = null }) => {
  // State management
  const [orders, setOrders] = useState(null)
  const [ordersAlmc, setOrdersAlmc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'fec_ped', direction: 'desc' })
  const [expandedFilters, setExpandedFilters] = useState(false)

  const navigate = useNavigate()
  let didFetch = false

  // Data fetching
  const getOrders = async () => {
    if (didFetch) return
    try {
      setLoading(true)
      const ord = await GetData(`${URL}/orders/all`)
      didFetch = true
      if (ord) {
        const sortedOrders = sortOrders(ord, sortConfig.key, sortConfig.direction)
        setOrders(divideList(sortedOrders, 10))
        setOrdersAlmc(sortedOrders)
      }
    } catch (err) {
      console.error('Error fetching orders:', errorStatusHandler(err))
    } finally {
      setLoading(false)
    }
  }

  // Sorting functionality
  const sortOrders = (orders, key, direction) => {
    return [...orders].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
  }

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    
    const sortedOrders = sortOrders(ordersAlmc, key, direction)
    setOrders(divideList(sortedOrders, 10))
    setOrdersAlmc(sortedOrders)
  }

  // Filtering functions
  const handleFilter = (term) => {
    setSearchTerm(term)
    const filterData = term 
      ? searchFilter(term, ordersAlmc, ['nom_per', 'ape_per', 'nom_met_pag', 'fec_ped'])
      : ordersAlmc
    
    setCurrentPage(1)
    setOrders(divideList(filterData, 10))
  }

  const handleFilterToState = (term) => {
    setStatusFilter(term)
    const filterData = term === 'all' 
      ? ordersAlmc 
      : searchFilter(term, ordersAlmc, ['sta_ped'])
    
    setCurrentPage(1)
    setOrders(divideList(filterData, 10))
  }

  // Status badge styling and icons
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDIENTE': return styles.statusPending
      case 'PROCESANDO': return styles.statusProcessing
      case 'ENVIADO': return styles.statusShipped
      case 'ENTREGADO': return styles.statusDelivered
      case 'CANCELADO': return styles.statusCancelled
      case 'REEMBOLSADO': return styles.statusRefunded
      default: return ''
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDIENTE': return <Clock size={14} />
      case 'PROCESANDO': return <RefreshCw size={14} />
      case 'ENVIADO': return <Truck size={14} />
      case 'ENTREGADO': return <CheckCircle size={14} />
      case 'CANCELADO': return <XCircle size={14} />
      default: return null
    }
  }

  // Initial data load
  useEffect(() => {
    getOrders()
  }, [])

  return (  
    <main className={styles.adminContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <header className={styles.headerTitle}>
          <header>
            <h1>Pedidos Recientes</h1>
            <p>Gestiona y monitorea los pedidos de tu tienda</p>
          </header>
          <nav>
            <NavLink 
              className={styles.filterButton}
              to={'/admin/orders/register'}
            >
              <Plus size={16} />
              Nuevo Pedido
            </NavLink>
          </nav>
        </header>
        
        <div className={styles.controls}>
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => handleFilter(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Filter Button */}
          <button 
            className={`${styles.filterButton} ${expandedFilters ? styles.active : ''}`}
            onClick={() => setExpandedFilters(!expandedFilters)}
          >
            <Filter size={16} />
            <span>Filtrar</span>
          </button>

          {/* Refresh Button */}
          <button 
            className={styles.refreshButton}
            onClick={getOrders}
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Expanded Filters */}
        {expandedFilters && (
          <div className={styles.filterPanel}>
            <div className={styles.filterGroup}>
              <label>Estado del pedido</label>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterToState(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="PROCESANDO">Procesando</option>
                <option value="ENVIADO">Enviado</option>
                <option value="ENTREGADO">Entregado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Ordenar por</label>
              <select
                value={sortConfig.key}
                onChange={(e) => requestSort(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="fec_ped">Fecha</option>
                <option value="subtotal_ped">Total</option>
                <option value="nom_per">Cliente</option>
                <option value="id_ped">Número</option>
              </select>
              <button
                onClick={() => requestSort(sortConfig.key)}
                className={styles.sortDirection}
              >
                <ArrowUpDown size={14} />
                {sortConfig.direction === 'asc' ? 'Asc' : 'Desc'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div 
            className={`${styles.headerCell} ${styles.orderId}`}
            onClick={() => requestSort('id_ped')}
          >
            <span>Pedido</span>
            {sortConfig.key === 'id_ped' && (
              <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </div>
          <div 
            className={`${styles.headerCell} ${styles.orderDate}`}
            onClick={() => requestSort('fec_ped')}
          >
            <Calendar size={14} />
            <span>Fecha</span>
            {sortConfig.key === 'fec_ped' && (
              <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </div>
          <div 
            className={`${styles.headerCell} ${styles.customer}`}
            onClick={() => requestSort('nom_per')}
          >
            <User size={14} />
            <span>Cliente</span>
            {sortConfig.key === 'nom_per' && (
              <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </div>
          <div className={`${styles.headerCell} ${styles.payment}`}>
            <CreditCard size={14} />
            <span>Pago</span>
          </div>
          <div className={`${styles.headerCell} ${styles.status}`}>
            <span>Estado</span>
          </div>
          <div 
            className={`${styles.headerCell} ${styles.amount}`}
            onClick={() => requestSort('subtotal_ped')}
          >
            <span>Total</span>
            {sortConfig.key === 'subtotal_ped' && (
              <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </div>
          <div className={`${styles.headerCell} ${styles.actions}`}>
            <span>Acciones</span>
          </div>
        </div>

        {orders && orders[currentPage - 1]?.length > 0 ? (
          orders[currentPage - 1].map(order => (
            <div 
              key={order.id_ped} 
              className={styles.orderRow}
              onClick={() => {
                setIdOrder(order.id_ped)
                navigate('/admin/orders/details')
              }}
            >
              <div className={`${styles.orderCell} ${styles.orderId}`}>
                <div className={styles.orderIdText}>#{order.id_ped}</div>
              </div>

              <div className={`${styles.orderCell} ${styles.orderDate}`}>
                <div className={styles.dateText}>
                  {formatDate(order.fec_ped, 'DD MMM YYYY')}
                </div>
                <div className={styles.timeText}>
                  {formatDate(order.fec_ped, 'HH:mm')}
                </div>
              </div>

              <div className={`${styles.orderCell} ${styles.customer}`}>
                <div className={styles.customerName}>
                  {order.nom_per} {order.ape_per}
                </div>
                <div className={styles.customerEmail}>
                  {order.email_per}
                </div>
              </div>

              <div className={`${styles.orderCell} ${styles.payment}`}>
                <div className={styles.paymentMethod}>
                  {order.nom_met_pag || 'N/A'}
                </div>
              </div>

              <div className={`${styles.orderCell} ${styles.status}`}>
                <div className={`${styles.statusBadge} ${getStatusBadgeClass(order.sta_ped)}`}>
                  {getStatusIcon(order.sta_ped)}
                  <span>{order.sta_ped}</span>
                </div>
              </div>

              <div className={`${styles.orderCell} ${styles.amount}`}>
                <div className={styles.amountText}>
                  ${formatNumber(order.subtotal_ped || 0)}
                </div>
                {order.des_ped > 0 && (
                  <div className={styles.discountBadge}>
                    {order.des_ped}% OFF
                  </div>
                )}
              </div>

              <div className={`${styles.orderCell} ${styles.actions}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIdOrder(order.id_ped)
                    navigate('/admin/orders/details')
                  }}
                  className={styles.detailsButton}
                >
                  <Eye size={14} />
                  <span>Detalles</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            <div className={styles.noResultsContent}>
              <p>No se encontraron pedidos</p>
              {searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    handleFilter('')
                  }}
                  className={styles.clearFiltersButton}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {orders && orders.length > 1 && (
        <div className={styles.paginationContainer}>
          <Paginacion
            data={orders}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}
      {loading && (
        <AdminLoadingScreen message='Cargando Información de pedidos' />
      )}
    </main>
  )
}