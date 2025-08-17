// Librarys 
import React, { useEffect, useState } from 'react'
import {
    User, Mail, Frown, Phone, MapPin,
    Lock, Calendar, CreditCard, Camera,
    X, Save
} from 'lucide-react'

// Imports 
import { CheckImage, errorStatusHandler, LegalAge, showAlert, showAlertLoading } from '../../../Utils/utils'
import { PostData } from '../../../Utils/Requests'
import AdminLoadingScreen from '../../Global/Loading'

// Import styles
import styles from '../../../styles/People/CustomerRegister.module.css'

// Component 
export const CustomerRegister = ({ URL = '', imgDefault = '' }) => {
    // Dynamic vars
    const [ avatarPreview, setAvatarPreview ] = useState('')
    const [ errors, setErrors ] = useState({})
    const [ isLoading, setIsLoading ] = useState(true)
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ formData, setFormData ] = useState({
        nom_per: '',
        nom2_per: '',
        ape_per: '',
        ape2_per: '',
        fec_nac_per: '',
        tip_doc_per: 'CC',
        doc_per: '',
        dir_per: '',
        cel_per: '',
        cel2_per: '',
        email_per: '',
        pas_per: '',
        confirmPassword: '',
        gen_per: '',
        fot_per: ''
    })


    // Manejo de cambios
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Limpiar error al cambiar
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }))
        }
    }

    // Manejo de imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result)
                setFormData(prev => ({
                    ...prev,
                    fot_per: reader.result
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    // Validación del formulario
    const validateForm = () => {
        const newErrors = {}

        if (!formData.nom_per) newErrors.nom_per = 'Nombre requerido'
        if (!formData.ape_per) newErrors.ape_per = 'Apellido requerido'
        if (!formData.doc_per) newErrors.doc_per = 'Documento requerido'
        if (!formData.email_per) {
            newErrors.email_per = 'Email requerido'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_per)) {
            newErrors.email_per = 'Email inválido'
        }
        if (!formData.cel_per) newErrors.cel_per = 'Celular requerido'
        if (!formData.pas_per) {
            newErrors.pas_per = 'Contraseña requerida'
        } else if (formData.pas_per.length < 8) {
            newErrors.pas_per = 'Mínimo 8 caracteres'
        }
        if (formData.pas_per !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        showAlertLoading('Cargando...', 'Por favor espera', 'info')
        try {
            const response = await PostData(`${URL}/peoples/register`, formData)
            console.log(response)
            if (response.success) {
                setIsSubmitting(false)
                showAlert('Éxito', 'Cliente registrado correctamente', 'success')
            }
        } catch (err) {
            setIsLoading(false)
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        setIsLoading(false)
    },[])

    return (
        <main className={styles.registerContainer}>
            <header className={styles.registerHeader}>
                <h2>Registrar Nuevo Cliente</h2>
                <p>Complete todos los campos requeridos para registrar un nuevo cliente</p>
            </header>

            <form onSubmit={handleSubmit} className={styles.registerForm}>
                {/* Sección de avatar */}
                <div className={styles.avatarSection}>
                    <div className={styles.formGroup}>
                        <label><Camera size={16} /> Imagen de Usuario</label>
                        <div className={styles.avatarPreview}>
                            <CheckImage 
                                src={formData?.fot_per || 'No-registrado'}
                                imgDefault={imgDefault}
                                alt="Preview image"
                            />
                        </div>
                        <input
                            type="text"
                            name='fot_per'
                            onChange={handleChange}
                            className={errors.fot_per ? styles.errorInput : ''}
                            placeholder="URL de imagen"
                            />
                        {errors.nom_per && <span className={styles.errorText}>{errors.nom_per}</span>}
                    </div>
                </div>

                {errors.general && (
                    <div className={styles.errorMessage}>
                        <Frown size={16} /> {errors.general}
                    </div>
                )}

                {/* Grid de 2 columnas */}
                <div className={styles.formGrid}>
                    {/* Columna 1 */}
                    <div className={styles.formColumn}>
                        <div className={styles.formGroup}>
                            <label><User size={16} /> Nombre*</label>
                            <input
                                type="text"
                                name="nom_per"
                                value={formData.nom_per}
                                onChange={handleChange}
                                placeholder="Primer nombre"
                                className={errors.nom_per ? styles.errorInput : ''}
                            />
                            {errors.nom_per && <span className={styles.errorText}>{errors.nom_per}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Segundo Nombre</label>
                            <input
                                type="text"
                                name="nom2_per"
                                value={formData.nom2_per}
                                onChange={handleChange}
                                placeholder="Segundo nombre (opcional)"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label><User size={16} /> Apellido*</label>
                            <input
                                type="text"
                                name="ape_per"
                                value={formData.ape_per}
                                onChange={handleChange}
                                placeholder="Primer apellido"
                                className={errors.ape_per ? styles.errorInput : ''}
                            />
                            {errors.ape_per && <span className={styles.errorText}>{errors.ape_per}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Segundo Apellido</label>
                            <input
                                type="text"
                                name="ape2_per"
                                value={formData.ape2_per}
                                onChange={handleChange}
                                placeholder="Segundo apellido (opcional)"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label><Calendar size={16} /> Fecha de Nacimiento</label>
                            <input
                                type="date"
                                name="fec_nac_per"
                                max={LegalAge()}
                                value={formData.fec_nac_per}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Columna 2 */}
                    <div className={styles.formColumn}>
                        <div className={styles.formGroup}>
                            <label><CreditCard size={16} /> Tipo de Documento*</label>
                            <select
                                name="tip_doc_per"
                                value={formData.tip_doc_per}
                                onChange={handleChange}
                            >
                                <option value="CC">CC</option>
                                <option value="DNI">DNI</option>
                                <option value="CE">Cedula Extranjería</option>
                                <option value="PAS">Pasaporte</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label><CreditCard size={16} /> Número de Documento*</label>
                            <input
                                type="text"
                                name="doc_per"
                                value={formData.doc_per}
                                onChange={handleChange}
                                placeholder="Número de documento"
                                className={errors.doc_per ? styles.errorInput : ''}
                            />
                            {errors.doc_per && <span className={styles.errorText}>{errors.doc_per}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label><Mail size={16} /> Email*</label>
                            <input
                                type="email"
                                name="email_per"
                                value={formData.email_per}
                                onChange={handleChange}
                                placeholder="Correo electrónico"
                                className={errors.email_per ? styles.errorInput : ''}
                            />
                            {errors.email_per && <span className={styles.errorText}>{errors.email_per}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label><Phone size={16} /> Celular Principal*</label>
                            <input
                                type="tel"
                                name="cel_per"
                                value={formData.cel_per}
                                onChange={handleChange}
                                placeholder="Número de Celular"
                                className={errors.cel_per ? styles.errorInput : ''}
                            />
                            {errors.cel_per && <span className={styles.errorText}>{errors.cel_per}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label><Phone size={16} /> Celular Secundario</label>
                            <input
                                type="tel"
                                name="cel2_per"
                                value={formData.cel2_per}
                                onChange={handleChange}
                                placeholder="Celular adicional (opcional)"
                            />
                        </div>
                    </div>

                    {/* Columna 3 */}
                    <div className={styles.formColumn}>
                        <div className={styles.formGroup}>
                            <label><MapPin size={16} /> Dirección</label>
                            <input
                                type="text"
                                name="dir_per"
                                value={formData.dir_per}
                                onChange={handleChange}
                                placeholder="Dirección completa"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Género</label>
                            <select
                                name="gen_per"
                                value={formData.gen_per}
                                onChange={handleChange}
                            >
                                {/* <option value="">Seleccionar...</option> */}
                                <option value="">Cacorro</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="FEMENINO">Femenino</option>
                                <option value="OTRO">Otro</option>
                                <option value="PREFIERO_NO_DECIR">Prefiero no decir</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label><Lock size={16} /> Contraseña*</label>
                            <input
                                type="password"
                                name="pas_per"
                                value={formData.pas_per}
                                onChange={handleChange}
                                placeholder="Mínimo 8 caracteres"
                                className={errors.pas_per ? styles.errorInput : ''}
                            />
                            {errors.pas_per && <span className={styles.errorText}>{errors.pas_per}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label><Lock size={16} /> Confirmar Contraseña*</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repita la contraseña"
                                className={errors.confirmPassword ? styles.errorInput : ''}
                            />
                            {errors.confirmPassword && (
                                <span className={styles.errorText}>{errors.confirmPassword}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={() => alert('No sirve papi te me calmas!!')}
                        className={styles.cancelButton}
                        disabled={isSubmitting}
                    >
                        <X size={16} /> Cancelar
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            'Registrando...'
                        ) : (
                            <>
                                <Save size={16} /> Registrar Cliente
                            </>
                        )}
                    </button>
                </div>
            </form>
            {isLoading && (
                <AdminLoadingScreen message='Cargando...' />
            )}
        </main>
    )
}