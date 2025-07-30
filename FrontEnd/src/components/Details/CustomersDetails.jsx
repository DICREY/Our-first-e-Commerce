// Librarys 
import React, { useState } from 'react'
import { Check, Mail, PenOff, Plus, SquarePen, User } from 'lucide-react'

// Imports 
import { CheckImage, errorStatusHandler, formatDate, getAge, showAlert, showAlertLoading } from '../../Utils/utils'
import { ModifyData } from '../../Utils/Requests'
import AdminLoadingScreen from '../Global/Loading'

// Import styles
import styles from '../../styles/Details/CustomerDetail.module.css'

// Component 
export const CustomerDetail = ({ URL = '' , customer, imgDefault = '' }) => {
    // Dynamic vars 
    const [note, setNote] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [customerData, setCustomerData] = useState({
        ...customer,
        email: customer?.email_per || '',
        vat: customer?.vat_number || 'No VAT number',
        des_per: customer?.des_per || 'No Description'
    })

    const handleAddNote = () => {
        console.log('Nota agregada:', note)
        setNote('')
    }

    const handleSaveChanges = async () => {
        try {
            showAlertLoading('Guardando cambios...', 'Por favor espera', 'info')
            customerData.fec_nac_per = formatDate(customerData.fec_nac_per)
            const response = await ModifyData(`${URL}/peoples/modify`, customerData)
            
            if (response?.success) {
                setIsEditing(false)
                showAlert('Éxito', 'Los cambios se han guardado correctamente', 'success')
            }
        } catch (error) {
            const message = errorStatusHandler(error)
            showAlert('Error', message, 'error')
        }
    }

    if (!customer) {
        return (
            <div className={styles.notFound}>
                <h2>Cliente no encontrado</h2>
                <p>No se pudo cargar la información del cliente solicitado.</p>
            </div>
        )
    }

    return (
        <main className={styles.mainContent}>
            <div className={styles.customerDetail}>
                <header className={styles.header}>
                    <span>
                        {customer?.fot_per && (
                            <CheckImage 
                                className={styles.customerAvatar}
                                src={customer.fot_per}
                                imgDefault={imgDefault}
                                alt=''
                            />
                        )}
                        <div className={styles.customerTitle}>
                            <h1>{customer?.nom_per} {customer?.ape_per}</h1>
                            <p className={styles.customerEmail}>
                                <Mail />
                                {customer?.email_per}
                            </p>
                            <p className={styles.customerEmail}>
                                <User />
                                {customer?.roles}
                            </p>
                        </div>
                    </span>
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
                        Cliente registrado el {formatDate(customer?.fec_cre_per)} a las {new Date(customer?.fec_cre_per).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                            <span className={styles.detailLabel}>Nombre:</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={customerData.nom_per}
                                    onChange={(e) => setCustomerData({ ...customerData, nom_per: e.target.value })}
                                    className={styles.editInput}
                                    placeholder="Ingrese el nombre"
                                />
                            ) : (
                                <span className={styles.detailValue}>{customerData.nom_per}</span>
                            )}
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Segundo nombre:</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={customerData.nom2_per}
                                    onChange={(e) => setCustomerData({ ...customerData, nom2_per: e.target.value })}
                                    className={styles.editInput}
                                    placeholder="Ingrese el segundo nombre"
                                />
                            ) : (
                                <span className={styles.detailValue}>{customerData.nom2_per}</span>
                            )}
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Apellido:</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={customerData.ape_per}
                                    onChange={(e) => setCustomerData({ ...customerData, ape_per: e.target.value })}
                                    className={styles.editInput}
                                    placeholder="Ingrese el segundo apellido"
                                />
                            ) : (
                                <span className={styles.detailValue}>{customerData.ape_per}</span>
                            )}
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Segundo apellido:</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={customerData.ape2_per}
                                    onChange={(e) => setCustomerData({ ...customerData, ape2_per: e.target.value })}
                                    className={styles.editInput}
                                    placeholder="Ingrese el apellido"
                                />
                            ) : (
                                <span className={styles.detailValue}>{customerData.ape2_per}</span>
                            )}
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Fecha nacimiento:</span>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={formatDate(customerData.fec_nac_per || '00-00-0000')}
                                    onChange={(e) => setCustomerData({ ...customerData, fec_nac_per: e.target.value })}
                                    className={styles.editInput}
                                    placeholder="Ingrese la fecha de nacimiento"
                                />
                            ) : (
                                <span className={styles.detailValue}>{formatDate(customerData.fec_nac_per)} ({getAge(customerData.fec_nac_per)})</span>
                            )}
                        </div>
                        
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Descripción:</span>
                            {isEditing ? (
                                <textarea
                                    value={customerData.des_per}
                                    onChange={(e) => setCustomerData({ ...customerData, des_per: e.target.value })}
                                    className={styles.editTextarea}
                                    placeholder="Agregue una descripción"
                                />
                            ) : (
                                <span className={styles.detailValue}>{customerData.des_per}</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.detailsColumn}>
                        <h3 className={styles.detailsSubtitle}>Información de Contacto</h3>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Email:</span>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={customerData.email}
                                    onChange={(e) => setCustomerData({ ...customerData, email_per: e.target.value })}
                                    className={styles.editInput}
                                    placeholder="Ingrese el email"
                                />
                            ) : (
                                <span className={styles.detailValue}>{customerData.email}</span>
                            )}
                        </div>
                        
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Dirección:</span>
                            {isEditing ? (
                                <textarea
                                    value={customerData.dir_per}
                                    onChange={(e) => setCustomerData({ ...customerData, dir_per: e.target.value })}
                                    className={styles.editTextarea}
                                    rows={3}
                                    placeholder="Dirección completa"
                                />
                            ) : (
                                <span className={styles.detailValue}>
                                    {customerData?.dir_per?.split(',')?.map((line, i) => (
                                        <span key={i}>{line?.trim()}<br /></span>
                                    ))}
                                </span>
                            )}
                        </div>
                        
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Celular:</span>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={customerData.cel_per}
                                    onChange={(e) => setCustomerData({ ...customerData, cel_per: e.target.value })}
                                    className={styles.editInput}
                                    placeholder="Número de celular"
                                />
                            ) : (
                                <span className={styles.detailValue}>{customerData.cel_per}</span>
                            )}
                        </div>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Celular Secundario:</span>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={customerData.cel2_per || ''}
                                    onChange={(e) => setCustomerData({ ...customerData, cel2_per: e.target.value })}
                                    className={styles.editInput}
                                    placeholder="Número de celular secundario"
                                />
                            ) : (
                                <span className={styles.detailValue}>{customerData.cel2_per}</span>
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
            {isLoading && (
                <AdminLoadingScreen message='Cargando detalles del cliente' />
            )}
        </main>
    )
}