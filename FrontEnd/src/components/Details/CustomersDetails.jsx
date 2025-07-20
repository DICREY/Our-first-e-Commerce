// Librarys 
import React, { useEffect, useState } from 'react'
import { Check, Mail, PenOff, Plus, SquarePen } from 'lucide-react'

// Imports 

// Import styles
import styles from '../../styles/Details/CustomerDetail.module.css'

// Component 
export const CustomerDetail = ({ URL = '' , customer }) => {
    // Dynamic vars 
    const [note, setNote] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [customerData, setCustomerData] = useState({
        email: customer?.email_per || '',
        phone: customer?.cel_per || '',
        address: customer?.dir_per || '',
        vat: customer?.vat_number || 'No VAT number',
        description: customer?.description || 'No Description'
    })

    const handleAddNote = () => {
        console.log('Nota agregada:', note)
        setNote('')
    }

    const handleSaveChanges = () => {
        console.log('Datos actualizados:', customerData)
        setIsEditing(false)
    }

    if (isLoading) {
        return (
            <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Cargando información del cliente...</p>
            </div>
        )
    }

    if (!customer) {
        return (
            <div className={styles.notFound}>
                <h2>Cliente no encontrado</h2>
                <p>No se pudo cargar la información del cliente solicitado.</p>
            </div>
        )
    }

    useEffect(() => {
        setIsLoading(false)
    },[])

    return (
        <main className={styles.mainContent}>
            <div className={styles.customerDetail}>
                <header className={styles.header}>
                    <div className={styles.customerTitle}>
                        <h1>{customer?.nom_per} {customer?.ape_per}</h1>
                        <p className={styles.customerEmail}>
                            <Mail />
                            {customer?.email_per}
                        </p>
                    </div>
                    <button 
                        className={styles.addNoteButton}
                        onClick={() => document.getElementById('noteInput').focus()}
                    >
                        <Plus />
                        Agregar nota
                    </button>
                </header>

                <hr className={styles.divider} />

                <div className={styles.metaInfo}>
                    <span>
                        Cliente registrado el {new Date(customer?.fec_cre_per).toLocaleDateString()} a las {new Date(customer?.fec_cre_per).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <hr className={styles.divider} />

                <h2 className={styles.sectionTitle}>Detalles del Cliente</h2>

                <section className={styles.detailsGrid}>
                    <div className={styles.detailsColumn}>
                        <h3 className={styles.detailsSubtitle}>Información Personal</h3>
                        
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Documento:</span>
                            <span className={styles.detailValue}>{customer?.doc_per}</span>
                        </div>
                        
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Email:</span>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={customerData.email}
                                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                                    className={styles.editInput}
                                    placeholder="Ingrese el email"
                                />
                            ) : (
                                <span className={styles.detailValue}>{customerData.email}</span>
                            )}
                        </div>
                        
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Descripción:</span>
                            {isEditing ? (
                                <textarea
                                    value={customerData.description}
                                    onChange={(e) => setCustomerData({ ...customerData, description: e.target.value })}
                                    className={styles.editTextarea}
                                    placeholder="Agregue una descripción"
                                />
                            ) : (
                                <span className={styles.detailValue}>{customerData.description}</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.detailsColumn}>
                        <h3 className={styles.detailsSubtitle}>Información de Contacto</h3>
                        
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Dirección:</span>
                            {isEditing ? (
                                <textarea
                                    value={customerData.address}
                                    onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                                    className={styles.editTextarea}
                                    rows={3}
                                    placeholder="Dirección completa"
                                />
                            ) : (
                                <span className={styles.detailValue}>
                                    {customerData.address?.split(',').map((line, i) => (
                                        <span key={i}>{line.trim()}<br /></span>
                                    ))}
                                </span>
                            )}
                        </div>
                        
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Celular:</span>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={customerData.phone}
                                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                                    className={styles.editInput}
                                    placeholder="Número de celular"
                                />
                            ) : (
                                <span className={styles.detailValue}>{customerData.phone}</span>
                            )}
                        </div>
                        
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>VAT:</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={customerData.vat}
                                    onChange={(e) => setCustomerData({ ...customerData, vat: e.target.value })}
                                    className={styles.editInput}
                                    placeholder="Ingrese el VAT"
                                />
                            ) : (
                                <span className={styles.detailValue}>{customerData.vat}</span>
                            )}
                        </div>
                    </div>
                </section>

                <section className={styles.noteSection}>
                    <h3 className={styles.sectionTitle}>Notas del Cliente</h3>
                    <textarea
                        id="noteInput"
                        placeholder="Agregue una nota sobre este cliente..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className={styles.noteInput}
                    />
                    <button onClick={handleAddNote} className={styles.saveNoteButton}>
                        <Check />
                        Guardar Nota
                    </button>
                </section>

                <div className={styles.actions}>
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>
                                <PenOff />
                                Cancelar
                            </button>
                            <button onClick={handleSaveChanges} className={styles.saveButton}>
                                <Check />
                                Guardar Cambios
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className={styles.editButton}>
                            <SquarePen />
                            Editar Información
                        </button>
                    )}
                </div>
            </div>
        </main>
    )
}