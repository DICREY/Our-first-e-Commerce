// Librarys 
import React, { useContext, useEffect, useState } from 'react'
import { 
  User, Mail, Phone, MapPin, Lock, Camera, Save, X, Calendar, CreditCard 
} from 'lucide-react'

// Imports 
import { AuthContext } from '../../Contexts/Contexts'
import { PostData } from '../../Utils/Requests'
import { CheckImage, errorStatusHandler, formatDate } from '../../Utils/utils'

// Import styles 
import styles from '../../styles/People/AdminProfile.module.css'

// Component 
export const AdminProfile = ({ URL = '', imgDefault = '' }) => {
  // Vars 
  let didFetch = false
  const { user, roles } = useContext(AuthContext)

  // Dynamic vars 
  const [formData, setFormData] = useState()
  const [avatarPreview, setAvatarPreview] = useState(user.img || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
        setFormData(prev => ({ ...prev, fot_per: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
     
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const GetData = async () => {
    if (didFetch) return
    try {
      const response = await PostData(`${URL}/peoples/by`,{ by: user.doc })
      didFetch = true
      if (response && response[0]) {
        setFormData(response[0])
        setAvatarPreview(user.img)
      }
      setIsLoading(false)
    } catch (err) {
      const message = errorStatusHandler(err)
      console.error('Error fetching customers:', message)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    GetData()
  })

  return (
    <div className={styles.profileEditorContainer}>
      <div className={styles.profileHeader}>
        <h2>Editar Perfil de Usuario</h2>
        <p>Actualiza la información personal y de contacto</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarUpload}>
            <CheckImage 
              className={styles.avatarPreview} 
              src={avatarPreview}
              imgDefault={imgDefault}
            >
              {!avatarPreview && <User size={48} />}
            </CheckImage>
            <label htmlFor="avatar-upload" className={styles.uploadButton}>
              <Camera size={16} /> Cambiar Foto
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className={styles.hiddenInput} 
              />
            </label>
          </div>
        </div>

        <div className={styles.formGrid}>
          {/* Columna 1 */}
          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label><User size={16} /> Nombre</label>
              <input
                type="text"
                name="nom_per"
                value={formData?.nom_per}
                onChange={handleChange}
                placeholder="Nombre"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label><User size={16} /> Apellido</label>
              <input
                type="text"
                name="ape_per"
                value={formData?.ape_per}
                onChange={handleChange}
                placeholder="Apellido"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label><Calendar size={16} /> Fecha de Nacimiento</label>
              <input
                type="date"
                name="fec_nac_per"
                value={formatDate(formData?.fec_nac_per)}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label><CreditCard size={16} /> Documento</label>
              <input
                type="text"
                name="doc_per"
                value={formData?.doc_per}
                onChange={handleChange}
                placeholder="Número de documento"
                required
                disabled
              />
            </div>
          </div>

          {/* Columna 2 */}
          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label><Mail size={16} /> Email</label>
              <input
                type="email"
                name="email_per"
                value={formData?.email_per}
                onChange={handleChange}
                placeholder="Correo electrónico"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label><Phone size={16} /> Teléfono Principal</label>
              <input
                type="tel"
                name="cel_per"
                value={formData?.cel_per}
                onChange={handleChange}
                placeholder="Teléfono principal"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label><Phone size={16} /> Teléfono Secundario</label>
              <input
                type="tel"
                name="cel2_per"
                value={formData?.cel2_per}
                onChange={handleChange}
                placeholder="Teléfono secundario (opcional)"
              />
            </div>

            <div className={styles.formGroup}>
              <label><MapPin size={16} /> Dirección</label>
              <input
                type="text"
                name="dir_per"
                value={formData?.dir_per}
                onChange={handleChange}
                placeholder="Dirección completa"
              />
            </div>
          </div>

          {/* Columna 3 */}
          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label>Género</label>
              <select
                name="gen_per"
                value={formData?.gen_per}
                onChange={handleChange}
              >
                <option value="">Seleccionar...</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label><Lock size={16} /> Nueva Contraseña</label>
              <input
                type="password"
                name="pas_per"
                value={formData?.pas_per}
                onChange={handleChange}
                placeholder="Dejar en blanco para no cambiar"
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label>Roles</label>
              <div className={styles.rolesDisplay}>
                {roles || 'Sin roles asignados'}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button 
            type="button" 
            onClick={() => alert('No sirve papi te me calmas!!')}
            className={styles.cancelButton}
          >
            <X size={16} /> Cancelar
          </button>
          <button 
            // type="submit" 
            type="button"
            className={styles.saveButton} 
            disabled={isLoading}
            onClick={() => alert('No sirve papi te me calmas!!')}
          >
            {isLoading ? 'Guardando...' : <><Save size={16} /> Guardar Cambios</>}
          </button>
        </div>
      </form>
    </div>
  )
}