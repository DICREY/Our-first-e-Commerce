// Librarys 
import React, { useEffect, useState } from 'react'
import {
    User, Mail, Frown, Phone, MapPin,
    Lock, Calendar, CreditCard, Camera,
    X, Save
} from 'lucide-react'
import { useForm } from 'react-hook-form'

// Imports 
import { CheckImage, errorStatusHandler, LegalAge, showAlert, showAlertLoading } from '../../../Utils/utils'
import { PostData } from '../../../Utils/Requests'
import AdminLoadingScreen from '../../../components/Global/Loading'

// Import styles
import styles from './CustomerRegister.module.css'

// Component 
export const CustomerRegister = ({ URL = '', imgDefault = '' }) => {
    // Dynamic vars
    const [ isLoading, setIsLoading ] = useState(true)
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ formData, setFormData ] = useState({})

    // Form config 
    const { register, getValues, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' })

    // Envío del formulario
    const onSubmit = async (data) => {
        console.log(data)
        setIsSubmitting(true)
        showAlertLoading('Cargando...', 'Por favor espera', 'info')
        try {
            const response = await PostData(`${URL}/peoples/register`, data)
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

            <form onSubmit={handleSubmit(onSubmit)} className={styles.registerForm}>
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
                            className={errors.fot_per ? styles.errorInput : ''}
                            placeholder="URL de imagen"
                            {...register('fot_per')}
                        />
                        {errors.fot_per && (
                            <p id="fot_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                            {errors.fot_per.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Grid de 2 columnas */}
                <div className={styles.formGrid}>
                    {/* Columna 1 */}
                    <div className={styles.formColumn}>
                        <div className={styles.formGroup}>
                            <label><User size={16} /> Nombre*</label>
                            <input
                                type="text"
                                name="nom_per"
                                placeholder="Primer nombre"
                                className={errors.nom_per ? styles.errorInput : ''}
                                {...register('nom_per', { 
                                    required: 'Nombre requerido',
                                    minLength: {
                                        value: 3,
                                        message: 'Debe contener al menos 3 caracteres',
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: 'Debe contener menos de 100 caracteres',
                                    },
                                })}
                            />
                            {errors.nom_per && (
                                <p id="nom_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.nom_per.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Segundo Nombre (Opcional)</label>
                            <input
                                type="text"
                                name="nom2_per"
                                placeholder="Segundo nombre"
                                {...register('nom2_per')}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label><User size={16} /> Apellido*</label>
                            <input
                                type="text"
                                name="ape_per"
                                placeholder="Primer apellido"
                                className={errors.ape_per ? styles.errorInput : ''}
                                {...register('ape_per', { 
                                    required: 'Apellido requerido',
                                    minLength: {
                                        value: 3,
                                        message: 'Debe contener al menos 3 caracteres',
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: 'Debe contener menos de 100 caracteres',
                                    },
                                })}
                            />
                            {errors.ape_per && (
                                <p id="ape_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.ape_per.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Segundo Apellido (Opcional)</label>
                            <input
                                type="text"
                                name="ape2_per"
                                placeholder="Segundo apellido (opcional)"
                                {...register('ape2_per')}
                                />
                        </div>

                        <div className={styles.formGroup}>
                            <label><Calendar size={16} /> Fecha de Nacimiento*</label>
                            <input
                                type="date"
                                name="fec_nac_per"
                                {...register('fec_nac_per', { 
                                    validate: value => {
                                        if (value > LegalAge()) {
                                            return 'Debe ser mayor de edad'
                                        }
                                    },
                                    max: {
                                        value: new Date().toISOString().split('T')[0],
                                        message: 'La fecha no puede ser en el futuro'
                                    },
                                    required: 'Fecha de nacimiento requerida'
                                })}
                            />
                            {errors.fec_nac_per && (
                                <p id="fec_nac_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.fec_nac_per.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Columna 2 */}
                    <div className={styles.formColumn}>
                        <div className={styles.formGroup}>
                            <label><CreditCard size={16} /> Tipo de Documento (Opcional)</label>
                            <select
                                name="tip_doc_per"
                                {...register('tip_doc_per')}
                            >
                                <option value="CC">CC</option>
                                <option value="DNI">DNI</option>
                                <option value="CE">Cedula Extranjería</option>
                                <option value="PAS">Pasaporte</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label><CreditCard size={16} /> Número de Documento (Opcional)</label>
                            <input
                                type="text"
                                name="doc_per"
                                placeholder="Número de documento"
                                className={errors.doc_per ? styles.errorInput : ''}
                                {...register('doc_per', { 
                                    minLength: {
                                        value: 5,
                                        message: 'Debe contener al menos 5 caracteres',
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: 'Debe contener menos de 20 caracteres',
                                    },
                                })}
                            />
                            {errors.doc_per && (
                                <p id="doc_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.doc_per.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label><Mail size={16} /> Email*</label>
                            <input
                                type="email"
                                name="email_per"
                                placeholder="Correo electrónico"
                                className={errors.email_per ? styles.errorInput : ''}
                                {...register('email_per', { 
                                    required: 'Email requerido',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Email inválido'
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: 'Debe contener menos de 100 caracteres',
                                    },
                                })}
                            />
                            {errors.email_per && (
                                <p id="email_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.email_per.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label><Phone size={16} /> Celular Principal (Opcional)</label>
                            <input
                                type="tel"
                                name="cel_per"
                                placeholder="Número de Celular"
                                className={errors.cel_per ? styles.errorInput : ''}
                                {...register('cel_per', { 
                                    pattern: {
                                        value: /^[0-9]{7,15}$/,
                                        message: 'Número de celular inválido'
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: 'Debe contener menos de 20 caracteres',
                                    },
                                })}
                            />
                            {errors.cel_per && (
                                <p id="cel_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.cel_per.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label><Phone size={16} /> Celular Secundario (Opcional)</label>
                            <input
                                type="tel"
                                name="cel2_per"
                                placeholder="Celular adicional (opcional)"
                                {...register('cel2_per', { 
                                    pattern: {
                                        value: /^[0-9]{7,15}$/,
                                        message: 'Número de celular inválido'
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: 'Debe contener menos de 20 caracteres',
                                    },
                                })}
                            />
                            {errors.cel2_per && (
                                <p id="cel2_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.cel2_per.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Columna 3 */}
                    <div className={styles.formColumn}>
                        <div className={styles.formGroup}>
                            <label><MapPin size={16} /> Dirección (Opcional)</label>
                            <input
                                type="text"
                                name="dir_per"
                                placeholder="Dirección completa"
                                {...register('dir_per', { 
                                    maxLength: {
                                        value: 200,
                                        message: 'Debe contener menos de 200 caracteres',
                                    },
                                })}
                            />
                            {errors.dir_per && (
                                <p id="dir_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.dir_per.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Género (Opcional)</label>
                            <select
                                name="gen_per"
                                {...register('gen_per')}
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
                                placeholder="Mínimo 8 caracteres"
                                className={errors.pas_per ? styles.errorInput : ''}
                                {...register('pas_per', {
                                    minLength: {
                                        value: 8,
                                        message: 'Debe contener al menos 8 caracteres',
                                    },
                                    required: 'Contraseña requerida',
                                    maxLength: {
                                        value: 100,
                                        message: 'Debe contener menos de 100 caracteres',
                                    },
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                        message: 'Debe contener una letra mayuscula, minuscula, número y un carácter especial',
                                    },
                                })}
                            />
                            {errors.pas_per && (
                                <p id="pas_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.pas_per.message}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label><Lock size={16} /> Confirmar Contraseña*</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Repita la contraseña"
                                className={errors.confirmPassword ? styles.errorInput : ''}
                                {...register('confirmPassword', { 
                                    validate: value => 
                                        value === getValues('pas_per') || 'Las contraseñas no coinciden',
                                    required: 'Confirmación de contraseña requerida',
                                    maxLength: {
                                        value: 100,
                                        message: 'Debe contener menos de 100 caracteres',
                                    },
                                })} 
                            />
                            {errors.confirmPassword && (
                                <p id="confirmPassword-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.confirmPassword.message}
                                </p>
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