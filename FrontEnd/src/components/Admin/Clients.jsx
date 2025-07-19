// Librarys 
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Imports 
import { Paginacion } from '../Global/Paginacion'
import { divideList, errorStatusHandler, searchFilter } from '../../Utils/utils'
import { GetData } from '../../Utils/Requests'
import { NavAdmin } from '../Navs/NavAdmin'

// Import styles 
import styles from '../../styles/Admin/CustomersList.module.css'

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

    const handleFilter = (term) => {
        const filterData = searchFilter(term,customersAlmc,['nom_per','ape_per','doc_per','cel_per','email_per'])
        if (filterData) setCustomers(divideList(filterData, 12))
        setCurrentPage(1)
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
        <main className={styles.mainContent}>
            <header className={styles.header}>
                <h1>Personas Registradas</h1>
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
            </header>

            <nav className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar clientes por nombre, apellido, email, celular o documento"
                    onChange={(e) => handleFilter(e.target.value)}
                    className={styles.searchInput}
                />
            </nav>

            <main className={styles.customersTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.headerCell}>Nombre</div>
                    <div className={styles.headerCell}>Email</div>
                    <div className={styles.headerCell}>Celular</div>
                    <div className={styles.headerCell}>Dirección</div>
                    <div className={styles.headerCell}>Accion</div>
                </div>

                {customers? (
                    customers[currentPage -1]?.map((customer, idx) => (
                        <div key={idx} className={styles.customerRow}>
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
            </main>

            <Paginacion
                data={customers}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
            />
        </main>
    )
}