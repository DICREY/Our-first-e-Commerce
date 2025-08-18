// Librarys 
import { useState } from "react"

import styles from './Paginacion.module.css'

// Component 
export const Paginacion = ({ data = [], setCurrentPage, currentPage = 1 }) => {
    // Functions 
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <footer className={styles.pagination}>
            {data?.map((i, idx) => (
                <button
                    key={idx}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`${styles.pageButton} ${currentPage === idx + 1 ? styles.active : ''}`}
                >
                    {idx + 1}
                </button>
            ))}
        </footer>
    )
}