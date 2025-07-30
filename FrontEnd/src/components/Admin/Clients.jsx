// Librarys 
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Eye, Edit, ChevronDown, ChevronUp } from 'lucide-react'

// Imports 
import { Paginacion } from '../Global/Paginacion'
import { divideList, errorStatusHandler, formatDate, searchFilter, showAlert } from '../../Utils/utils'
import { GetData } from '../../Utils/Requests'
import AdminLoadingScreen from '../Global/Loading'

// Import styles 
import styles from '../../styles/Admin/CustomersList.module.css'

// Component 
export const Customers = ({ URL = '', ImgDefault = '', setCustomer }) => {
    // Dynamic vars
    const [ customers, setCustomers ] = useState([])
    const [ filteredCustomers, setFilteredCustomers ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ count, setCount ] = useState(1)
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ sortConfig, setSortConfig ] = useState({ key: null, direction: 'asc' })
    const [ activeFilters, setActiveFilters ] = useState({
        status: 'all',
        registrationDate: 'all'
    })

    // Hooks
    const navigate = useNavigate()
    const itemsPerPage = 10

    // Fetch customers
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true)
                const response = await GetData(`${URL}/peoples/all`)
                const formattedData = response.map(customer => ({
                    ...customer,
                    registrationDate: formatDate(customer.fec_cre_per)
                }))

                setCustomers(formattedData)
                setFilteredCustomers(divideList(formattedData,12))
                setLoading(false)
            } catch (err) {
                const message = errorStatusHandler(err)
                showAlert('Error', message, 'error')
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [URL])

    // Apply filters and search
    useEffect(() => {
        let result = [...customers]

        // Apply search
        if (searchTerm) {
            result = searchFilter(searchTerm, result, ['nom_per', 'ape_per', 'doc_per', 'cel_per', 'email_per'])
        }
        
        // Apply filters
        if (activeFilters?.status !== 'all') {
            console.log(activeFilters.status)
            result = searchFilter(activeFilters.status, result, ['estado'])
        }

        if (activeFilters.registrationDate !== 'all') {
            const now = new Date()
            const cutoffDate = new Date(now)

            if (activeFilters.registrationDate === 'today') {
                cutoffDate.setDate(now.getDate() - 1)
            } else if (activeFilters.registrationDate === 'week') {
                cutoffDate.setDate(now.getDate() - 7)
            } else if (activeFilters.registrationDate === 'month') {
                cutoffDate.setMonth(now.getMonth() - 1)
            }

            result = result.filter(customer => new Date(customer.registrationDate) > cutoffDate)
        }

        setFilteredCustomers(divideList(result,12))
        setCurrentPage(1)
    }, [customers, searchTerm, activeFilters])

    // Format initials for avatar
    const formatInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    // Sort data
    const requestSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })

        const sorted = [...customers].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
            return 0
        })

        setFilteredCustomers(divideList(sorted,12))
    }

    // Handle filter change
    const handleFilterChange = (filterKey, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterKey]: value
        }))
    }

    const biClick = (data) => {
        setCount(count+1)
        if (count === 2) {
            setCustomer(data)
            navigate('/admin/customers/details')
        }
    }

    return (
        <main className={styles.adminContainer}>
            <header className={styles.header}>
                <h1>Administración de Clientes</h1>
                <div className={styles.controls}>
                    <div className={styles.searchContainer}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Buscar clientes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Estado:</label>
                        <select
                            value={activeFilters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">Todos</option>
                            <option value="DISPONIBLE">Disponible</option>
                            <option value="NO-DISPONIBLE">No disponible</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Registro:</label>
                        <select
                            value={activeFilters.registrationDate}
                            onChange={(e) => handleFilterChange('registrationDate', e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">Todos</option>
                            <option value="today">Hoy</option>
                            <option value="week">Esta semana</option>
                            <option value="month">Este mes</option>
                        </select>
                    </div>

                    <div className={styles.actions}>
                        <Link to="/admin/customers/register" className={styles.primaryButton}>
                            <Plus size={16} /> Nuevo Cliente
                        </Link>
                    </div>
                </div>
            </header>

            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th
                                className={styles.sortableHeader}
                                onClick={() => requestSort('nom_per')}
                            >
                                <div className={styles.headerContent}>
                                    Nombre
                                    <span className={styles.sortIcon}>
                                        {sortConfig.key === 'nom_per' ? (
                                            sortConfig.direction === 'asc' ? (
                                                <ChevronUp size={16} />
                                            ) : (
                                                <ChevronDown size={16} />
                                            )
                                        ) : (
                                            <ChevronDown size={16} opacity={0.3} />
                                        )}
                                    </span>
                                </div>
                            </th>
                            <th>Contacto</th>
                            <th
                                className={styles.sortableHeader}
                                onClick={() => requestSort('registrationDate')}
                            >
                                <div className={styles.headerContent}>
                                    Fecha Registro
                                    <span className={styles.sortIcon}>
                                        {sortConfig.key === 'registrationDate' ? (
                                            sortConfig.direction === 'asc' ? (
                                                <ChevronUp size={16} />
                                            ) : (
                                                <ChevronDown size={16} />
                                            )
                                        ) : (
                                            <ChevronDown size={16} opacity={0.3} />
                                        )}
                                    </span>
                                </div>
                            </th>
                            <th>Documento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>    
                        {filteredCustomers ? (
                            filteredCustomers[currentPage - 1]?.map((customer, idx) => (
                                <tr
                                    key={idx + 97}
                                    className={styles.dataRow}
                                    onClick={() => biClick(customer)}
                                >
                                    <td>
                                        <div className={styles.customerInfo}>
                                            <div className={styles.avatar}>
                                                {formatInitials(customer.nom_per, customer.ape_per)}
                                            </div>
                                            <div>
                                                <div className={styles.name}>
                                                    {customer.nom_per} {customer.ape_per}
                                                </div>
                                                <div className={styles.email}>
                                                    {customer.email_per}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.contactInfo}>
                                            <div className={styles.phone}>
                                                {customer.cel_per}
                                            </div>
                                            <div className={styles.address}>
                                                {customer.dir_per}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {formatDate(customer.registrationDate)}
                                    </td>
                                    <td>
                                        {customer.doc_per}
                                    </td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button
                                                onClick={() => {
                                                    setCustomer(customer)
                                                    navigate('/admin/customers/details')
                                                }}
                                                className={styles.viewButton}
                                            >
                                                <Eye size={16} /> Ver
                                            </button>
                                            <button
                                                onClick={() => alert('No sirve papi te me calmas!!')}
                                                // onClick={() => {
                                                //     setCustomer(customer)
                                                //     navigate('/admin/customers/details')
                                                // }}
                                                className={styles.editButton}
                                            >
                                                <Edit size={16} /> Editar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className={styles.noResultsRow}>
                                <td colSpan={5}>
                                    No se encontraron clientes que coincidan con los criterios de búsqueda
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className={styles.footer}>
                <div className={styles.resultsInfo}>
                    Mostrando {filteredCustomers[currentPage - 1]?.length} de {customers?.length} clientes
                </div>
                <Paginacion
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    data={filteredCustomers}
                />
            </div>
            {loading && (
                <AdminLoadingScreen message='Cargando Información de clientes' />
            )}
        </main>
    )
}