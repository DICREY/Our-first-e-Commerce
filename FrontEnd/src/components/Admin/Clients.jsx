// Librarys 
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Imports 
import { Paginacion } from '../Global/Paginacion'

// Import styles 
import styles from '../../styles/Admin/CustomersList.module.css'
import { divideList, errorStatusHandler } from '../../Utils/utils'
import { GetData } from '../../Utils/Requests'

// Component 
export const Customers = ({ URL = '', ImgDefault = '' }) => {
    // Dynamic vars
    const [ customers, setCustomers ] = useState(null)
    const [ customersAlmc, setCustomersAlmc ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ searchTerm, setSearchTerm   ] = useState('')
    const [ currentPage, setCurrentPage ] = useState(1)

    const getCustomers = async () => {
        try {
            const cust = await GetData(`${URL}/peoples/all`)
            if (cust) {
                setCustomers(divideList(cust, 12))
                setCustomersAlmc(cust)
                setLoading(false)
            }
        } catch (err) {
            setLoading(false)
            const message = errorStatusHandler(err)
            console.log(message)
        }
    }

    useEffect(() => {
        getCustomers()
    }, [])

    const formatInitials = (firstName, lastName) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    if (loading) {
        return <div className={styles.loading}>Loading customers...</div>
    }

    return (
        <main className={styles.customersMainContainer}>
            <main className={styles.customersContainer}>
                <div className={styles.header}>
                    <h1>Customers</h1>
                    <div className={styles.actions}>
                        <Link to="/customers/new" className={styles.newButton}>
                            + New
                        </Link>
                        <button className={styles.actionButton}>
                            + Filter
                        </button>
                        <button className={styles.actionButton}>
                            + Export
                        </button>
                    </div>
                </div>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.customersTable}>
                    <div className={styles.tableHeader}>
                        <div className={styles.headerCell}>Nombre</div>
                        <div className={styles.headerCell}>Email</div>
                        <div className={styles.headerCell}>Celular</div>
                        <div className={styles.headerCell}>Dirección</div>
                        <div className={styles.headerCell}>Accion</div>
                    </div>

                    {customers? (
                        customers[currentPage -1]?.map(customer => (
                            <div key={customer.id_per} className={styles.customerRow}>
                                <div className={styles.customerCell}>
                                    <div className={styles.customerAvatar}>
                                        {formatInitials(customer.nom_per, customer.ape_per)}
                                    </div>
                                    <div className={styles.customerName}>
                                        {customer.nom_per} {customer.ape_per}
                                    </div>
                                </div>

                                <div className={styles.customerCell}>
                                    <a href={`mailto:${customer.email_per}`} className={styles.emailLink}>
                                        {customer.email_per}
                                    </a>
                                </div>

                                <div className={styles.customerCell}>
                                    <a href={`tel:${customer.cel_per}`} className={styles.phoneLink}>
                                        {customer.cel_per}
                                    </a>
                                </div>

                                <div className={styles.customerCell}>
                                    {customer.dir_per}
                                </div>

                                <div className={styles.customerCell}>
                                    <Link
                                        to={`/customers/${customer.id_per}`}
                                        className={styles.viewButton}
                                    >
                                        View
                                    </Link>
                                    <button className={styles.editButton}>
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            No customers found matching your criteria.
                        </div>
                    )}
                </div>

                <Paginacion
                    data={customers}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                />
            </main>
        </main>
    )
}