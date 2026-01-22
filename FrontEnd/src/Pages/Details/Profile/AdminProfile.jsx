// Librarys 
import React, { useContext, useEffect, useState } from 'react'
import {
  User, Mail, Phone, MapPin, Camera, Save, X, Calendar, CreditCard, Edit,
  LockKeyhole
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

// Imports 
import { AuthContext } from '../../../Contexts/Contexts'
import { ModifyData, PostData } from '../../../Utils/Requests'
import { CheckImage, errorStatusHandler, formatDate, getAge, LegalAge, showAlert, showAlertInput, showAlertLoading, showAlertSelect } from '../../../Utils/utils'
import AdminLoadingScreen from '../../../components/Global/Loading'

// Import styles 
import styles from './AdminProfile.module.css'

// Component 
export const AdminProfile = ({ URL = '', imgDefault = '' }) => {
  // Vars 
  const { user, login } = useContext(AuthContext)
  const navigate = useNavigate()
  let didFetch = false
  
  // Estados
  const [ avatarPreview, setAvatarPreview ] = useState(user?.img || '')
  const [ initialData, setInitialData ] = useState(null)
  const [ imgExpand, setImgExpand ] = useState(null)
  const [ isLoading, setIsLoading ] = useState(true)
  const [ isEditing, setIsEditing ] = useState(false)
  const [ hasChanges, setHasChanges ] = useState(false)

  // Form config 
  let { register, handleSubmit, getValues, setValue, reset, clearErrors, formState: { errors } } = useForm({ 
    mode: 'onChange',
    defaultValues: initialData
  })

  // Actualizar valores del formulario cuando initialData cambia
  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  // Envío del formulario
  const onSubmit = async (data) => {
    showAlertLoading('Cargando...', 'Por favor espera', 'info')

    try {
      setValue('fec_nac_per', formatDate(data.fec_nac_per))
      const allData = getValues()
      console.log(allData)
      const response = await ModifyData(`${URL}/peoples/modify`, allData)

      if (response.success) {
        fetchData()
        setIsEditing(false)
        setInitialData(allData)
        setHasChanges(false)
        clearErrors()
        showAlert('Éxito', 'Perfil actualizado correctamente', 'success')
      }
    } catch (error) {
      const message = errorStatusHandler(error)
      showAlert('Error', message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Cancelar edición
  const handleCancel = () => {
    setIsEditing(false)    
    setAvatarPreview(initialData?.fot_per || user?.img || '')
    setHasChanges(false)
  }

  // Obtener datos iniciales
  const fetchData = async () => {
    if (didFetch) return
    try {
      const response = await PostData(`${URL}/peoples/by`, { by: user.email })
      didFetch = true
      if (response && response[0]) {
        const userData = response[0]
        setInitialData(userData)
        setAvatarPreview(userData.fot_per || user?.img || '')
        setIsLoading(false)
      }
    } catch (err) {
      setIsLoading(false)
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  const ChangePassword = async (email) => {
    try {
      const passwd = await showAlertInput('Cambiar contraseña', 'password','Ingrese su nueva Contraseña')
      if (!passwd) return
      showAlertLoading('Cambiando su contraseña', 'Por favor, espere...', 'info')
      const modPwd = await ModifyData(`${URL}/credential/change-password`,{
        email: email,
        password: passwd
      })
      if (modPwd?.success) {
        showAlert('Contraseña cambiada','Su contraseña a sido cambiada satisfactoriamente','success')
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  const VerifyPassword = async () => {
    try {
      const isAdd = await showAlertSelect('Editar Contraseña','¿Desea cambiar su contraseña?','question')
      if (isAdd) {
        // Verify ask 
        const verifyCred = async (URL = '', email = '') => {
          const passwd = await showAlertInput('Verificar Credenciales', 'password','Ingrese su Contraseña actual')
          if (!passwd) return
          showAlertLoading('Verificando credenciales', 'Por favor, espere...', 'info')
          return await login(`${URL}/credential/login`, { firstData: email, secondData: await passwd })
        }
        const verify = await verifyCred(URL, getValues('email_per'))
        if (verify?.logged) await ChangePassword(getValues('email_per'))
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchData()
  }, [user?.email])

  return (
    <>
      {isLoading? (
        <AdminLoadingScreen message='Cargando información del perfil...' />
      ):(
        <main className={styles.profileEditorContainer}>
          <header className={styles.profileHeader}>
            <h2>Perfil de {user.names} {user.lastNames} </h2>
            <p>{isEditing ? 'Edita tu información personal' : 'Visualiza tu información personal'}</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.profileForm}>
            <nav className={styles.avatarSection}>
              <div className={styles.avatarUpload}>
                <picture
                  onClick={() => setImgExpand(avatarPreview || 'no-image')}
                >
                  <CheckImage
                    className={styles.avatarPreview}
                    src={avatarPreview}
                    imgDefault={imgDefault}
                  >
                    {!avatarPreview && <User size={48} />}
                  </CheckImage>
                </picture>
                {isEditing && (
                  <>
                    <label htmlFor="avatar-upload" className={styles.uploadButton}>
                      <Camera size={16} /> Cambiar Foto
                      <div className={styles.formGroup}>

                      <input
                        name='fot_per'
                        type="text"
                        placeholder='Url de imagen'
                        {...register('fot_per', {
                          value: getValues('fot_per') || '',
                          onChange: (e) => {
                            setAvatarPreview(e.target.value)
                            setHasChanges(true)
                          },
                          maxLength: {
                            value: 255,
                            message: 'La URL es demasiado larga'
                          }
                        })}
                      />
                      {errors.fot_per && (
                        <p id="fot_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                          {errors.fot_per.message}
                        </p>
                      )}
                      </div>
                    </label>
                    {getValues('fot_per') && (
                      <button
                        type="button"
                        className={styles.removeAvatarButton}
                        onClick={() => {
                          setAvatarPreview('')
                          setValue('fot_per', '')
                          setHasChanges(true)
                        }}
                      >
                        Eliminar foto
                      </button>
                    )}
                  </>
                )}
              </div>
            </nav>

            {!isEditing && (
              <span>
                <button
                  type="button"
                  className={styles.editToggleButton}
                  onClick={() => setIsEditing(true)}
                  >
                  <Edit size={16} /> Editar Perfil
                </button>
                <button
                  type="button"
                  className={styles.editToggleButton}
                  onClick={() => navigate(`/email-reset?em=${user.email}`)}
                  >
                  <Edit size={16} /> Cambiar Email
                </button>
              </span>
            )}

            <div className={styles.formGrid}>
              {/* Columna 1 */}
              <div className={styles.formColumn}>
                <div className={styles.formGroup}>
                  <label><User size={16} /> Nombre</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nom_per"
                      placeholder="Nombre"
                      {...register('nom_per', {
                        value: getValues('nom_per') || '',
                        required: 'El nombre es obligatorio',
                        maxLength: {
                          value: 50,
                          message: 'El nombre no puede exceder los 50 caracteres'
                        },
                        minLength: {
                          value: 2,
                          message: 'El nombre debe tener al menos 2 caracteres'
                        }
                      })}
                    />
                    
                  ) : (
                    <div className={styles.readOnlyField}>{getValues('nom_per') || 'No especificado'}</div>
                  )}
                  {errors.nom_per && (
                    <p id="nom_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                      {errors.nom_per.message}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label><User size={16} /> Apellido</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="ape_per"
                      placeholder="Apellido"
                      {...register('ape_per', {
                        value: getValues('ape_per') || '',
                        required: 'El apellido es obligatorio',
                        maxLength: {
                          value: 50,
                          message: 'El apellido no puede exceder los 50 caracteres'
                        },
                        minLength: {
                          value: 2,
                          message: 'El apellido debe tener al menos 2 caracteres'
                        }
                      })}
                    />
                  ) : (
                    <div className={styles.readOnlyField}>{getValues('ape_per') || 'No especificado'}</div>
                  )}
                  {errors.ape_per && (
                    <p id="ape_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                      {errors.ape_per.message}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label><Calendar size={16} /> Fecha de Nacimiento</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="fec_nac_per"
                      {...register('fec_nac_per', { 
                        required: 'La fecha de nacimiento es obligatoria',
                        value: getValues('fec_nac_per') || '',
                        validate: value => {
                          if (value > LegalAge()) {
                            return 'Debe ser mayor de edad'
                          }
                        }
                      })}
                    />
                  ) : (
                    <div className={styles.readOnlyField}>
                      {getValues('fec_nac_per') ? `${formatDate(getValues('fec_nac_per'))} (${getAge(getValues('fec_nac_per'))} Años)` : 'No especificada'}
                    </div>
                  )}
                  {errors.fec_nac_per && (
                    <p id="fec_nac_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                      {errors.fec_nac_per.message}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label><CreditCard size={16} /> Documento</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="doc_per"
                      placeholder="Numero de documento"
                      {...register('doc_per', {
                        value: getValues('doc_per') || '',
                        maxLength: {
                          value: 20,
                          message: 'El documento no puede exceder los 20 caracteres'
                        },
                        minLength: {
                          value: 5,
                          message: 'El documento debe tener al menos 5 caracteres'
                        }
                      })}
                    />
                  ) : (
                    <div className={styles.readOnlyField}>{getValues('doc_per') || 'N/A'}</div>
                  )}
                  {errors.doc_per && (
                    <p id="doc_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                      {errors.doc_per.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Columna 2 */}
              <div className={styles.formColumn}>
                <div className={styles.formGroup}>
                  <label><User size={16} />Segundo nombre</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nom2_per"
                      placeholder="Segundo nombre"
                      {...register('nom2_per', {
                        value: getValues('nom2_per') || '',
                        minLength: {
                          value: 2,
                          message: 'Debe contener minimo 2 characteres'
                        },
                        maxLength: {
                          value: 100,
                          message: 'Debe contener menos de 100 characteres'
                        },
                      })}
                    />
                  ) : (
                    <div className={styles.readOnlyField}>{getValues('nom2_per') || 'No especificado'}</div>
                  )}
                  {errors.nom2_per && (
                    <p id="nom2_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                      {errors.nom2_per.message}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label><User size={16} />Segundo apellido</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="ape2_per"
                      placeholder="Segundo apellido"
                      {...register('ape2_per', {
                        value: getValues('ape2_per') || '',
                        minLength: {
                          value: 2,
                          message: 'Debe contener minimo 2 characteres'
                        },
                        maxLength: {
                          value: 100,
                          message: 'Debe contener menos de 100 characteres'
                        },
                      })}
                    />
                  ) : (
                    <div className={styles.readOnlyField}>{getValues('ape2_per') || 'No especificado'}</div>
                  )}
                  {errors.ape2_per && (
                    <p id="ape2_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                      {errors.ape2_per.message}
                    </p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label><Mail size={16} /> Email</label>  
                  <div className={styles.readOnlyField}>{getValues('email_per') || 'No especificado'}</div>
                </div>

                <div className={styles.formGroup}>
                  <label><Phone size={16} /> Celular Principal</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="cel_per"
                      placeholder="Celular principal"
                      {...register('cel_per', {
                        value: getValues('cel_per') || '',
                        maxLength: {
                          value: 15,
                          message: 'El celular no puede exceder los 15 caracteres'
                        },
                        minLength: {
                          value: 7,
                          message: 'El celular debe tener al menos 7 caracteres'
                        }
                      })}
                    />
                  ) : (
                    <div className={styles.readOnlyField}>{getValues('cel_per') || 'No especificado'}</div>
                  )}
                  {errors.cel_per && (
                    <p id="cel_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                      {errors.cel_per.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Columna 3 */}
              <div className={styles.formColumn}>
                <div className={styles.formGroup}>
                  <label><MapPin size={16} /> Dirección</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="dir_per"
                      placeholder="Dirección completa"
                      {...register('dir_per', {
                        value: getValues('dir_per') || '',
                        maxLength: {
                          value: 255,
                          message: 'La dirección no puede exceder los 255 caracteres'
                        },
                        minLength: {
                          value: 5,
                          message: 'La dirección debe tener al menos 5 caracteres'
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9\s,'-]*$/,
                          message: 'La dirección contiene caracteres inválidos'
                        }
                      })}
                    />
                  ) : (
                    <div className={styles.readOnlyField}>
                      {getValues('dir_per') || 'No especificada'}
                    </div>
                  )}
                  {errors.dir_per && (
                    <p id="dir_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                      {errors.dir_per.message}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Género</label>
                  {isEditing ? (
                    <select
                      name="gen_per"
                      {...register('gen_per', {
                        value: getValues('gen_per') || ''
                      })}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMENINO">Femenino</option>
                      <option value="OTRO">Otro</option>
                    </select>
                  ) : (
                    <div className={styles.readOnlyField}>
                      {getValues('gen_per') === 'MASCULINO' ? 'Masculino' : 
                      getValues('gen_per') === 'FEMENINO' ? 'Femenino' : 
                      getValues('gen_per') === 'OTRO' ? 'Otro' : 'No especificado'}
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label><Phone size={16} />Celular Secundario</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="cel2_per"
                      placeholder="Celular secundario (opcional)"
                      {...register('cel2_per', {
                        value: getValues('cel2_per') || '',
                        maxLength: {
                          value: 15,
                          message: 'El Celular no puede exceder los 15 caracteres'
                        },
                        minLength: {
                          value: 7,
                          message: 'El Celular debe tener al menos 7 caracteres'
                        }
                      })}
                    />
                  ) : (
                    <div className={styles.readOnlyField}>{getValues('cel2_per') || 'No especificado'}</div>
                  )}
                  {errors.cel2_per && (
                    <p id="cel2_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                      {errors.cel2_per.message}
                    </p>
                  )}
                </div>

                <div 
                  className={styles.formGroup}
                  style={{ cursor: 'pointer' }}
                  onClick={VerifyPassword}
                >
                  <label><LockKeyhole size={16} />Contraseña</label>
                  <div className={styles.readOnlyField}>{'************'}</div>
                </div>

              </div>
            </div>

            {isEditing && (
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className='deleteButton'
                  disabled={isLoading}
                >
                  <X size={16} /> Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Guardando...'
                  ) : (
                    <>
                      <Save size={16} /> Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
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
          
        </main>
      )}
    </>
  )
}