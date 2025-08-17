// Librarys 
import React, { useContext, useEffect, useState, useRef } from 'react'
import {
  User, Mail, Phone, MapPin, Camera, Save, X, Calendar, CreditCard, Edit
} from 'lucide-react'

// Imports 
import { AuthContext } from '../../../Contexts/Contexts'
import { ModifyData, PostData } from '../../../Utils/Requests'
import { CheckImage, errorStatusHandler, formatDate, getAge, LegalAge, showAlert, showAlertLoading } from '../../../Utils/utils'
import AdminLoadingScreen from '../../Global/Loading'

// Import styles 
import styles from '../../../styles/People/AdminProfile.module.css'

// Component 
export const AdminProfile = ({ URL = '', imgDefault = '' }) => {
  // Vars 
  const { user, roles } = useContext(AuthContext)
  const fileInputRef = useRef(null)
  let didFetch = false
  
  // Estados
  const [ avatarPreview, setAvatarPreview ] = useState(user?.img || '')
  const [ initialData, setInitialData ] = useState(null)
  const [ imgExpand, setImgExpand ] = useState(null)
  const [ isLoading, setIsLoading ] = useState(true)
  const [ isEditing, setIsEditing ] = useState(false)
  const [ hasChanges, setHasChanges ] = useState(false)
  const [ formData, setFormData ] = useState({
    nom_per: '',
    nom2_per: '',
    ape_per: '',
    ape2_per: '',
    fec_nac_per: '',
    doc_per: '',
    dir_per: '',
    cel_per: '',
    cel2_per: '',
    email_per: '',
    gen_per: '',
    fot_per: ''
  })

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      checkForChanges(newData)
      return newData
    })
  }

  // Verifica si hay cambios
  const checkForChanges = (currentData) => {
    const changed = Object.keys(currentData).some(
      key => initialData && currentData[key] !== initialData[key]
    )
    setHasChanges(changed)
  }

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    showAlertLoading('Cargando...', 'Por favor espera', 'info')

    try {
      formData.fec_nac_per = formatDate(formData.fec_nac_per)
      const response = await ModifyData(`${URL}/peoples/modify`, formData)
      
      if (response.success) {
        fetchData()
        setIsEditing(false)
        setInitialData(formData)
        setHasChanges(false)
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
    setFormData(initialData)
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
        setFormData(userData)
        setAvatarPreview(userData.fot_per || user?.img || '')
        setIsLoading(false)
      }
    } catch (err) {
      setIsLoading(false)
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchData()
  }, [user?.doc])

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

          <form onSubmit={handleSubmit} className={styles.profileForm}>
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
                        value={formData.fot_per || ''}
                        onChange={handleChange}
                        placeholder='Url de imagen'
                      />
                      </div>
                    </label>
                    {formData.fot_per && (
                      <button
                        type="button"
                        className={styles.removeAvatarButton}
                        // onClick={() => alert('No sirve papi te me calmas!!')}
                        onClick={() => {
                          setAvatarPreview('')
                          setFormData(prev => ({ ...prev, fot_per: '' }))
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
              <button
                type="button"
                className={styles.editToggleButton}
                onClick={() => setIsEditing(true)}
              >
                <Edit size={16} /> Editar Perfil
              </button>
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
                      value={formData.nom_per || ''}
                      onChange={handleChange}
                      placeholder="Nombre"
                      required
                    />
                  ) : (
                    <div className={styles.readOnlyField}>{formData.nom_per || 'No especificado'}</div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label><User size={16} /> Apellido</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="ape_per"
                      value={formData.ape_per || ''}
                      onChange={handleChange}
                      placeholder="Apellido"
                      required
                    />
                  ) : (
                    <div className={styles.readOnlyField}>{formData.ape_per || 'No especificado'}</div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label><Calendar size={16} /> Fecha de Nacimiento</label>
                  {isEditing ? (
                    <input
                      type="date"
                      max={LegalAge()}
                      name="fec_nac_per"
                      value={formatDate(formData.fec_nac_per) || ''}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className={styles.readOnlyField}>
                      {formData.fec_nac_per ? `${formatDate(formData.fec_nac_per)} (${getAge(formData.fec_nac_per)} Años)` : 'No especificada'}
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label><CreditCard size={16} /> Documento</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="doc_per"
                      value={formData.doc_per || ''}
                      onChange={handleChange}
                      placeholder="Numero de documento"
                      required
                    />
                  ) : (
                    <div className={styles.readOnlyField}>{formData.doc_per || 'N/A'}</div>
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
                      value={formData.nom2_per || ''}
                      onChange={handleChange}
                      placeholder="Segundo nombre"
                      required
                    />
                  ) : (
                    <div className={styles.readOnlyField}>{formData.nom2_per || 'No especificado'}</div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label><User size={16} />Segundo apellido</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="ape2_per"
                      value={formData.ape2_per || ''}
                      onChange={handleChange}
                      placeholder="Segundo pellido"
                      required
                    />
                  ) : (
                    <div className={styles.readOnlyField}>{formData.ape2_per || 'No especificado'}</div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label><Mail size={16} /> Email</label>  
                  <div className={styles.readOnlyField}>{formData.email_per || 'No especificado'}</div>
                </div>

                <div className={styles.formGroup}>
                  <label><Phone size={16} /> Teléfono Principal</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="cel_per"
                      value={formData.cel_per || ''}
                      onChange={handleChange}
                      placeholder="Teléfono principal"
                    />
                  ) : (
                    <div className={styles.readOnlyField}>{formData.cel_per || 'No especificado'}</div>
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
                      value={formData.dir_per || ''}
                      onChange={handleChange}
                      placeholder="Dirección completa"
                    />
                  ) : (
                    <div className={styles.readOnlyField}>
                      {formData.dir_per || 'No especificada'}
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Género</label>
                  {isEditing ? (
                    <select
                      name="gen_per"
                      value={formData.gen_per || ''}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMENINO">Femenino</option>
                      <option value="OTRO">Otro</option>
                    </select>
                  ) : (
                    <div className={styles.readOnlyField}>
                      {formData.gen_per === 'MASCULINO' ? 'Masculino' : 
                      formData.gen_per === 'FEMENINO' ? 'Femenino' : 
                      formData.gen_per === 'OTRO' ? 'Otro' : 'No especificado'}
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label><Phone size={16} /> Teléfono Secundario</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="cel2_per"
                      value={formData.cel2_per || ''}
                      onChange={handleChange}
                      placeholder="Teléfono secundario (opcional)"
                    />
                  ) : (
                    <div className={styles.readOnlyField}>{formData.cel2_per || 'No especificado'}</div>
                  )}
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
                  disabled={isLoading || !hasChanges}
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