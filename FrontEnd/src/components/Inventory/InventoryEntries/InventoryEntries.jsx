// Libraries 
import React, { useEffect, useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'

// Imports 
import { errorStatusHandler, formatDate, formatNumber, showAlert } from '../../../Utils/utils'
import { GetData } from '../../../Utils/Requests'

// Styles
import styles from './InventoryEntries.module.css'

// Component 
const InventoryEntries = ({ URL }) => {
    const [entries, setEntries] = useState([])
    const [almcEntries, setAlmcEntries] = useState([])

    // Vars 
    const entryURL = `${URL}/inventory/entry`

    // Functions 
    // Handle remove entry
    const removeEntry = (id) => {
        setEntries(entries.filter(entry => entry.id !== id))
    }

    // Calculate totals
    const totalQuantity = entries.reduce((sum, entry) => sum + parseFloat(entry.cantidad || 0), 0)
    const totalCost = entries.reduce((sum, entry) => sum + (entry.subtotal || 0), 0)

    useEffect(() => {
        // Fetch existing entries from backend
        const fetchEntries = async () => {
            try {
                const get = await GetData(`${entryURL}/all`)
                if (get?.success) {
                    setEntries(get?.result || [])
                    setAlmcEntries(get?.result || [])
                }
            } catch (err) {
                const message = errorStatusHandler(err)
                showAlert('Error', message, 'error')
            }
        }

        fetchEntries()
    }, [entryURL])

    return (
        <div className={styles.content}>
            {/* Entries Table Section */}
            <div className={styles.tableSection}>

                {entries.length > 0 ? (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Producto</th>
                                    <th>Color</th>
                                    <th>Talla</th>
                                    <th>Cantidad</th>
                                    <th>Costo Unit.</th>
                                    <th>Subtotal</th>
                                    <th>Notas</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map(entry => (
                                    <tr key={entry.id_ent}>
                                        <td>{formatDate(entry.fec_ing_ent)}</td>
                                        <td>{entry.hor_ing_ent}</td>
                                        <td>{entry.nom_pro}</td>
                                        <td>
                                            <span className={styles.badge} style={{ color: entry.hex_col || '#fff' }}>
                                                {entry.nom_col}
                                            </span>
                                        </td>
                                        <td>{entry.nom_tal_pro}</td>
                                        <td className={styles.centered}>{entry.can_ent}</td>
                                        <td>${formatNumber(entry.cos_uni_ent)}</td>
                                        <td className={styles.bold}>${formatNumber(entry.costo_total)}</td>
                                        <td>{entry.not_ent || '-'}</td>
                                        <td className={styles.centered} style={{ display: 'flex' }}>
                                            <button
                                                type="button"
                                                className={'deleteButton'}
                                                onClick={() => removeEntry(entry.id)}
                                                title="Eliminar entrada"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                className='backButton'
                                                onClick={() => showAlert('info', 'Funcionalidad de edición en desarrollo')}
                                                title="Editar entrada"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Submit All Button */}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>No hay entradas registradas aún.</p>
                        <p>Agrega tus primeras entradas de inventario.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InventoryEntries