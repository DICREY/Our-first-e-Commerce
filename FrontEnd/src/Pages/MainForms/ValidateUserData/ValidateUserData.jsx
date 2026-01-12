// Librarys
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

// Imports 
import { decodeJWT, errorStatusHandler, LegalAge, showAlert, showAlertLoading } from "../../../Utils/utils"
import { PostData } from "../../../Utils/Requests"

// Import styles
import styles from './ValidateUserData.module.css'

// Component
export const ValidateData = ({ URL = '' }) => {
  // Vars
  const legalAge = LegalAge()
  const navigate = useNavigate()
  const gmailUserData = decodeJWT(localStorage.getItem('gmailUserData'))

  // Dynamic Vars
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: gmailUserData?.email || '',
    passwd: '',
    confirmPassword: '',
    gen_per: '',
    fec_nac_per: '',
    nom_per: gmailUserData?.nom_per || '',
    ape_per: gmailUserData?.ape_per || '',
    img: gmailUserData?.url_img || '',
    theme: gmailUserData?.theme || 'LIGHT'
  })

  // Functions
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nom_per.trim()) newErrors.nom_per = 'El nombre es requerido'

    if (!formData.ape_per.trim()) newErrors.ape_per = 'El apellido es requerido'

    if (!formData.passwd.trim()) {
      newErrors.passwd = 'La contraseña es requerida'
    } else if (formData.passwd.length < 8) {
      newErrors.passwd = 'La contraseña debe tener al menos 8 caracteres'
    }
    
    if (formData.passwd !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (!formData.fec_nac_per) newErrors.fec_nac_per = 'La fecha de nacimiento es requerida'
    if (formData.fec_nac_per > legalAge) newErrors.fec_nac_per = 'Debes ser mayor de edad'


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    showAlertLoading('Cargando...', 'Por favor espere', 'info')

    if (validateForm()) {
      try {        
        const post = await PostData(`${URL}/credential/login-google`, { 
          requestState: '2',
          ...formData
        })
        
        if(post) {
          showAlert('Éxito', 'Inicio de sesión exitoso', 'success')
          localStorage.removeItem('gmailUserData')
          setTimeout(() => {
            navigate('/')
          }, 2000)
        }
      } catch (err) {
        const message = errorStatusHandler(err)
        showAlert('Error', message, 'error')
      }
    }
  }

  return (
    <main className={styles["form-container"]}>
      <div className={styles["form-wrapper"]}>
        <div className={styles["form-header"]}>
          <h1 className={styles["form-title"]}>Completar Datos</h1>
          <p className={styles["form-subtitle"]}>Por favor completa todos los campos requeridos</p>
        </div>

        <form onSubmit={handleSubmit} className={styles["form"]}>
          {/* Email */}
          <div className={styles["form-group"]}>
              <label htmlFor="email" className={styles["form-label"]}>
                Correo Electrónico <span className={styles["required"]}></span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || 'example@gmail.com'}
                className={`${styles["form-input"]}`}
                disabled
                />
            </div>
          <section className={styles["form-section"]}>

            {/* Nombre */}
            {!gmailUserData?.nom_per && (
              <div className={styles["form-group"]}>
                <label htmlFor="nom_per" className={styles["form-label"]}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="nom_per"
                  name="nom_per"
                  value={formData.nom_per}
                  onChange={handleChange}
                  className={`${styles["form-input"]} ${errors.nom_per ? styles["input-error"] : ''}`}
                  placeholder="Ingresa tu Nombre"
                />
              </div>
            )}

            {/* Apellido */}
            {!gmailUserData?.ape_per && (
              <div className={styles["form-group"]}>
                <label htmlFor="ape_per" className={styles["form-label"]}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="ape_per"
                  name="ape_per"
                  value={formData.ape_per}
                  onChange={handleChange}
                  className={`${styles["form-input"]} ${errors.ape_per ? styles["input-error"] : ''}`}
                  placeholder="Ingresa tu Apellido"
                />
              </div>
            )}

            {/* Contraseña */}
            <div className={styles["form-group"]}>
              <label htmlFor="passwd" className={styles["form-label"]}>
                Contraseña <span className={styles["required"]}>*</span>
              </label>
              <div className={styles["password-wrapper"]}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="passwd"
                  name="passwd"
                  value={formData.passwd}
                  onChange={handleChange}
                  className={`${styles["form-input"]} ${errors.passwd ? styles["input-error"] : ''}`}
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  className={styles["toggle-password"]}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>
              {errors.passwd && <span className={styles["error-message"]}>{errors.passwd}</span>}
            </div>

            {/* Confirmar Contraseña */}
            <div className={styles["form-group"]}>
              <label htmlFor="confirmPassword" className={styles["form-label"]}>
                Confirmar Contraseña <span className={styles["required"]}>*</span>
              </label>
              <div className={styles["password-wrapper"]}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${styles["form-input"]} ${errors.confirmPassword ? styles["input-error"] : ''}`}
                  placeholder="Confirma tu contraseña"
                />
                <button
                  type="button"
                  className={styles["toggle-password"]}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <span className={styles["error-message"]}>{errors.confirmPassword}</span>}
            </div>

            {/* Género */}
            {!gmailUserData?.gen_per && (
              <div className={styles["form-group"]}>
                <label htmlFor="gen_per" className={styles["form-label"]}>
                  Género
                </label>
                <select
                  id="gen_per"
                  name="gen_per"
                  value={formData.gen_per}
                  onChange={handleChange}
                  className={styles["form-select"]}
                >
                  <option value="">Selecciona tu género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Other">Otro</option>
                  <option value="Prefer-not">Prefiero no decir</option>
                </select>
              </div>
            )}

            {/* Fecha de Nacimiento */}
            {!gmailUserData?.fec_nac_per && (
              <div className={styles["form-group"]}>
                <label htmlFor="fec_nac_per" className={styles["form-label"]}>
                  Fecha de Nacimiento <span className={styles["required"]}>*</span>
                </label>
                <input
                  type="date"
                  id="fec_nac_per"
                  name="fec_nac_per"
                  value={formData.fec_nac_per}
                  max={legalAge}
                  onChange={handleChange}
                  className={`${styles["form-input"]} ${errors.fec_nac_per ? styles["input-error"] : ''}`}
                  />
                {errors.fec_nac_per && <span className={styles["error-message"]}>{errors.fec_nac_per}</span>}
              </div>
            )}

          </section>
          {/* Botones */}
          <div className={styles["form-actions"]}>
            <button type="submit" className={styles["submit-btn"]}>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}