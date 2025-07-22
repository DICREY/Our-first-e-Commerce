// Librarys
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Imports
import { GetData } from '../../Utils/Requests'
import { Paginacion } from '../Global/Paginacion'
import { divideList, errorStatusHandler, formatDate, formatNumber, searchFilter } from '../../Utils/utils'

// Import styles
import styles from '../../styles/Admin/OrdersList.module.css'
import { Search } from 'lucide-react'
import AdminLoadingScreen from '../Global/Loading'

// Component 
export const OrdersList = ({ URL = '', setIdOrder = null, filterFetch = null }) => {
  // Dynamic vars 
  const [orders, setOrders] = useState(null)
  const [ordersAlmc, setOrdersAlmc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Vars
  const navigate = useNavigate()
  let didFetch = false

  // Functions 
  const getOrders = async () => {
    if (didFetch) return
    try {
      const ord = await GetData(`${URL}/orders/all`)
      didFetch = true
      if (ord) {
        setOrders(divideList(ord, 12))
        setOrdersAlmc(ord)
        setLoading(false)
      }
    } catch (err) {
      didFetch = true
      setLoading(false)
      const message = errorStatusHandler(err)
      console.log(message)
    }
  }

  const handleFilter = (term) => {
    const filterData = searchFilter(term, ordersAlmc, [
      'nom_per',
      'ape_per',
      'nom_met_pag',
      'fec_ped'
    ])
    if (filterData) {
      setCurrentPage(1)
      setOrders(divideList(filterData, 12))
    }
  }

  const handleFilterToState = (term) => {
    setStatusFilter(term)
    if (term === 'all') setOrders(divideList(ordersAlmc, 12))

    const filterData = searchFilter(term, ordersAlmc, ['sta_ped'])
    if (filterData) {
      setCurrentPage(1)
      setOrders(divideList(filterData, 12))
    }
  }

  useEffect(() => {
    getOrders()
    if (filterFetch) {
      const data = searchFilter(filterFetch,ordersAlmc,['sta_ped'])
      if(data) setOrders(data)
    }
  }, [])

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDIENTE': return styles.statusPending
      case 'PROCESANDO': return styles.statusProcessing
      case 'ENVIADO': return styles.statusShipped
      case 'ENTREGADO': return styles.statusDelivered
      case 'CANCELADO': return styles.statusCancelled
      default: return ''
    }
  }

  if (loading) {
    return <AdminLoadingScreen message='Cargando pedidos...' />
  }

  return (
    <main className={styles.mainContent}>
      <header className={styles.header}>
        <h1>Pedidos</h1>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search orders..."
              onChange={(e) => handleFilter(e.target.value)}
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}><Search size={14} /></span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => handleFilterToState(e.target.value)}
            className={styles.statusFilter}
          >
            <option value="">Todo</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="PROCESANDO">Procesando</option>
            <option value="ENVIADO">Enviado</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
      </header>

      <main className={styles.ordersTable}>
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>Pedido</div>
          <div className={styles.headerCell}>Fecha</div>
          <div className={styles.headerCell}>Cliente</div>
          <div className={styles.headerCell}>Estado</div>
          <div className={styles.headerCell}>Total</div>
          <div className={styles.headerCell}>Acción</div>
        </div>
        {orders ? (
          orders[currentPage - 1]?.map(order => (
            <section 
              key={order.id_ped} 
              className={styles.orderRow}
              onClick={() => {
                setIdOrder(order.id_ped)
                navigate('/admin/orders/details')
              }}
            >
              <div className={styles.orderCell}>
                <div className={styles.orderId}>#{order.id_ped}</div>
                <div className={styles.orderCustomerEmail}>{order.email_per}</div>
              </div>

              <div className={styles.orderCell}>
                {formatDate(order.fec_ped)}
              </div>

              <div className={styles.orderCell}>
                <div className={styles.customerName}>
                  {order.nom_per} {order.ape_per}
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
                ${formatNumber(order.subtotal_ped)}
              </div>

              <div className={styles.orderCell}>
                <button
                  onClick={() => {
                    setIdOrder(order.id_ped)
                    navigate('/admin/orders/details')
                  }}
                  className={styles.viewButton}
                >
                  View
                </button>
              </div>
            </section>
          ))
        ) : (
          <div className={styles.noResults}>
            No se encontraron pedidos registrados en el sistema
          </div>
        )}
      </main>

      <Paginacion
        data={orders}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </main>
  )
}