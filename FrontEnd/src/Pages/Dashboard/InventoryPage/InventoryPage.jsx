// Libraries
import { Plus} from 'lucide-react'
import { useState } from 'react'

// Imports 
import { useInventoryModal, InventoryModal } from '../../../components/Inventory/InventoryModal/InventoryModal'
import InventoryEntries from '../../../components/Inventory/InventoryEntries/InventoryEntries'
import InventoryView from '../../../components/Inventory/InventoryView/InventoryView'

// Styles 
import styles from './InventoryPage.module.css'

// Component
export const InventoryPage = ({ URL = '' }) => {
    // Dynamic Vars 
    const [ page, setPage ] = useState('inventory')
    const { isOpen, openModal, closeModal } = useInventoryModal()
    
    return (
        <div className={styles.container}>
            {/* Header con botón para abrir modal */}
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <h1>📦 Inventario</h1>
                    <p>Gestiona las entradas de inventario de tus productos</p>
                </div>
                <button
                    className='backButton'
                    onClick={openModal}
                    title="Agregar nueva entrada de inventario"
                >
                    <Plus size={24} />
                    <span>Agregar Entrada</span>
                </button>
            </div>

            {/* Modal flotante */}
            <InventoryModal
                URL={URL}
                isOpen={isOpen}
                onClose={closeModal}
            />
            
            {/* Contenido principal de la página */}
            <section className={styles.content}>
                <header className={styles.mainHeaderPage}>
                    <button 
                        className={styles.active}
                        onClick={() => setPage('inventory')}
                    >Inventario</button>
                    <button
                        onClick={() => setPage('entries')}
                    >Entradas</button>
                </header>
                <div className={styles.pageContent}>
                    {page === 'inventory'? (
                        <InventoryView URL={URL} />
                    ): (
                        <InventoryEntries URL={URL} />
                    )}
                </div>
            </section>

        </div>
    )
}

export default InventoryPage
