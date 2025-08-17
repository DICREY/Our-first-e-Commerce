// Librarys 
import React, { useContext, useEffect, useState } from 'react'
import { Check, ChevronLeft, Mail, NotebookPen, PenOff, SquarePen, Trash2, User, UserRoundPen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Imports 
import { CheckImage, errorStatusHandler, formatDate, getAge, LegalAge, showAlert, showAlertInput, showAlertLoading, showAlertSelect, verifyCred } from '../../../Utils/utils'
import { ModifyData, PostData } from '../../../Utils/Requests'
import { AuthContext } from '../../../Contexts/Contexts'
import AdminLoadingScreen from '../../Global/Loading'

// Import styles
import styles from '../../../styles/Details/CustomerDetail.module.css'
import Swal from 'sweetalert2'

// Component 
export const CustomerDetail = ({ URL = '' , imgDefault = '' }) => {
    // Dynamic vars 
    const [note, setNote] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [imgExpand, setImgExpand] = useState(null)
    const [customerData, setCustomerData] = useState(null)

    // Vars 
    let didFetch = false
    const navigate = useNavigate()
    const ID = localStorage.getItem('id_peo') || 0
    const roles = customerData?.roles?.split(', ')
    const { user, login } = useContext(AuthContext)

    const GetCustomer = async () => {
        try {
            if(didFetch) return
            const got = await PostData(`${URL}/peoples/by`, { by: ID })
            if (got && got?.[0]) {
                setCustomerData(got?.[0])
                setIsLoading(false)
                didFetch = true
            }
        } catch (err) {
            setIsLoading(false)
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
            didFetch = true
        }
    }

    // Functions 
    const handleAddNote = () => {
        console.log('Nota agregada:', note)
        setNote('')
    }

    const handleSaveChanges = async () => {
        try {
            showAlertLoading('Guardando cambios...', 'Por favor espera', 'info')
            customerData.fec_nac_per = formatDate(customerData?.fec_nac_per)
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

    const Deactivate = async (id) => {
        if (id === user?.doc) return showAlert('Error','No puedes eliminar a la persona con la sesión actual','error')

        const option = showAlertSelect('Eliminar persona','¿Desea eliminar a la persona del sistema?','question')

        if ((await option).isConfirmed) {
            try {
                showAlertLoading('Eliminando persona', 'Por favor, espere...', 'info')
                const del = await ModifyData(`${URL}/peoples/delete`, { by: id })
                if (del.success) {
                    showAlert('Éxito', 'Persona eliminada correctamente', 'success')
                    setTimeout(() => navigate("/admin/customers"),2000)
                }   
            } catch (err) {
                const message = errorStatusHandler(err)
                showAlert('Error', message, 'error')
            }
        }
    }

    const assignRol = async () => {
        try {
            const isAdd = await showAlertSelect('Editar Roles','¿Agregar o remover rol del usuario?','question','Remover', 'Agregar')
            const rolName = await Swal.fire({
                title: "Elige un rol",
                input: "select",
                inputOptions: {
                    Administrador: "Administrador",
                    Usuario: "Usuario"
                },
                inputPlaceholder: "Selecciona un Rol",
                showCancelButton: true,
                theme: localStorage.getItem('theme').toLowerCase() || 'light',
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value === "Usuario") {
                            resolve("El rol de usuario no se puede modificar")
                        } else resolve()
                    })
                }
            })    
            const data = {
                isAdd: await isAdd?.value,
                nom_rol: await rolName?.value,
                email_per: customerData.email_per
            }

            // Reques to Change rol
            const change = async () => {
                showAlertLoading('Cambiando roles', 'Por favor, espere...', 'info')
                const mod = await ModifyData(`${URL}/peoples/change-rol`, data)
                didFetch = false
                if (mod.success) {
                    GetCustomer()
                    showAlert('Roles Cambiados', 'Los roles han sido actualizados satisfactoriamente', 'success')
                }
            }

            // Verify ask 
            const verifyCred = async (URL = '', email = '') => {
                const passwd = await showAlertInput('Verificar Privilegios', 'password','Contraseña')
                showAlertLoading('Verificando credenciales', 'Por favor, espere...', 'info')
                return await login(`${URL}/credential/login`, { firstData: email, secondData: await passwd })
            }
            const verify = await verifyCred(URL, user.email)
            console.log(verify)
            if (verify?.logged) change()
                
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }

    const changeEmail = async () => {
        const option = showAlertSelect('Cambiar Email','¿Desea cambiar el email a está persona?','question')
        if ((await option).isConfirmed) {
            showAlert('','En construcción, Papi te me calmas!!','info')
        }
    }

    useEffect(() => {
        if (ID) GetCustomer()
    },[ID])

    if (!ID) {
        return (
            <div className={styles.notFound}>
                <h2>Cliente no encontrado</h2>
                <p>No se pudo cargar la información del cliente solicitado.</p>
            </div>
        )
    }

    return (
        <main className={styles.mainContent}>
            {isLoading? (
                <AdminLoadingScreen message='Cargando detalles del cliente' />
            ):(
                <div className={styles.customerDetail}>
                    <header className={styles.header}>
                        <span>
                            <picture
                                style={{ cursor: 'zoom-in' }}
                                onClick={() => setImgExpand(customerData?.fot_per || 'no-image')}
                            >
                                <CheckImage 
                                    className={styles.customerAvatar}
                                    src={customerData?.fot_per}
                                    imgDefault={imgDefault}
                                    alt=''
                                />
                            </picture>
                            <div className={styles.customerTitle}>
                                <h1>{customerData?.nom_per} {customerData?.ape_per}</h1>
                                <p className={styles.customerEmail}>
                                    <Mail />
                                    {customerData?.email_per}
                                    <button 
                                        type='button'
                                        className='backButton'
                                        onClick={changeEmail}
                                    >
                                        <NotebookPen />
                                    </button>
                                </p>
                                <p className={styles.customerEmail}>
                                    <User />
                                    {customerData?.roles}
                                    <button 
                                        type='button'
                                        className='backButton'
                                        onClick={assignRol}
                                    >
                                        <UserRoundPen />
                                    </button>
                                </p>
                            </div>
                        </span>
                        <nav>
                            <button
                                className='deleteButton'
                                onClick={() => Deactivate(customerData?.doc_per)}
                            >
                                <Trash2 />
                                Eliminar
                            </button>
                            <button 
                                className='backButton'
                                onClick={() => navigate('/admin/customers')}
                            >
                                <ChevronLeft />
                                Atrás
                            </button>
                        </nav>
                    </header>

                    <hr className={styles.divider} />

                    <div className={styles.metaInfo}>
                        <span>
                            Cliente registrado el {formatDate(customerData?.fec_cre_per)} a las {new Date(customerData?.fec_cre_per).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <hr className={styles.divider} />

                    <h2 className={styles.sectionTitle}>Detalles del Cliente</h2>

                    <section className={styles.detailsGrid}>
                        <div className={styles.detailsColumn}>
                            <h3 className={styles.detailsSubtitle}>Información Personal</h3>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Documento:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={customerData?.doc_per || 'N/A'}
                                        onChange={(e) => setCustomerData({ ...customerData, doc_per: e.target.value })}
                                        className={styles.editInput}
                                        placeholder="Ingrese el documento"
                                    />
                                ) : (
                                    <span className={styles.detailValue}>{customerData?.doc_per}</span>
                                )}
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Nombre:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={customerData?.nom_per}
                                        onChange={(e) => setCustomerData({ ...customerData, nom_per: e.target.value })}
                                        className={styles.editInput}
                                        placeholder="Ingrese el nombre"
                                    />
                                ) : (
                                    <span className={styles.detailValue}>{customerData?.nom_per}</span>
                                )}
                            </div>

                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Segundo nombre:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={customerData?.nom2_per || ''}
                                        onChange={(e) => setCustomerData({ ...customerData, nom2_per: e.target.value })}
                                        className={styles.editInput}
                                        placeholder="Ingrese el segundo nombre"
                                    />
                                ) : (
                                    <span className={styles.detailValue}>{customerData?.nom2_per || 'N/A'}</span>
                                )}
                            </div>

                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Apellido:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={customerData?.ape_per}
                                        onChange={(e) => setCustomerData({ ...customerData, ape_per: e.target.value })}
                                        className={styles.editInput}
                                        placeholder="Ingrese el segundo apellido"
                                    />
                                ) : (
                                    <span className={styles.detailValue}>{customerData?.ape_per || 'N/A'}</span>
                                )}
                            </div>

                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Segundo apellido:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={customerData?.ape2_per || ''}
                                        onChange={(e) => setCustomerData({ ...customerData, ape2_per: e.target.value })}
                                        className={styles.editInput}
                                        placeholder="Ingrese el apellido"
                                    />
                                ) : (
                                    <span className={styles.detailValue}>{customerData?.ape2_per || 'N/A'}</span>
                                )}
                            </div>

                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Fecha nacimiento:</span>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        max={LegalAge()}
                                        value={formatDate(customerData?.fec_nac_per || '00-00-0000')}
                                        onChange={(e) => setCustomerData({ ...customerData, fec_nac_per: e.target.value })}
                                        className={styles.editInput}
                                        placeholder="Ingrese la fecha de nacimiento"
                                    />
                                ) : (
                                    <span className={styles.detailValue}>{formatDate(customerData?.fec_nac_per)} ({getAge(customerData?.fec_nac_per)})</span>
                                )}
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Descripción:</span>
                                {isEditing ? (
                                    <textarea
                                        value={customerData?.des_per || ''}
                                        onChange={(e) => setCustomerData({ ...customerData, des_per: e.target.value })}
                                        className={styles.editTextarea}
                                        placeholder="Agregue una descripción"
                                    />
                                ) : (
                                    <span className={styles.detailValue}>{customerData?.des_per || 'N/A'}</span>
                                )}
                            </div>
                        </div>

                        <div className={styles.detailsColumn}>
                            <h3 className={styles.detailsSubtitle}>Información de Contacto</h3>

                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Email:</span>
                                <span className={styles.detailValue}>{customerData?.email_per}</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Dirección:</span>
                                {isEditing ? (
                                    <textarea
                                        value={customerData?.dir_per || 'N/A'}
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
                                        value={customerData?.cel_per || ''}
                                        onChange={(e) => setCustomerData({ ...customerData, cel_per: e.target.value })}
                                        className={styles.editInput}
                                        placeholder="Número de celular"
                                    />
                                ) : (
                                    <span className={styles.detailValue}>{customerData?.cel_per || 'N/A'}</span>
                                )}
                            </div>

                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Celular Secundario:</span>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={customerData?.cel2_per || ''}
                                        onChange={(e) => setCustomerData({ ...customerData, cel2_per: e.target.value })}
                                        className={styles.editInput}
                                        placeholder="Número de celular secundario"
                                    />
                                ) : (
                                    <span className={styles.detailValue}>{customerData?.cel2_per || 'N/A'}</span>
                                )}
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>VAT:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={customerData?.vat || ''}
                                        onChange={(e) => setCustomerData({ ...customerData, vat: e.target.value })}
                                        className={styles.editInput}
                                        placeholder="Ingrese el VAT"
                                    />
                                ) : (
                                    <span className={styles.detailValue}>{customerData?.vat || 'N/A'}</span>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className={styles.noteSection}>
                        <h3 className={styles.sectionTitle}>Notas del Cliente</h3>
                        <textarea
                            id="noteInput"
                            placeholder="Agregue una nota sobre este cliente..."
                            value={note || ''}
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
                    {imgExpand && (
                        <picture 
                            onClick={() => setImgExpand(null)}
                            className='activeImg'
                        >
                            <CheckImage
                                src={imgExpand}
                                imgDefault={imgDefault}
                            />
                        </picture>
                    )}
                </div>
            )}
        </main>
    )
}