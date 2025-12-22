// Librarys
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

// Imports 
import { LegalAge } from "../../../Utils/utils"

// Import styles
import styles from './ValidateUserData.module.css'

// Component
export const ValidateData = ({ URL = '', gmailUserData = {} }) => {
  // Dynamic Vars
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    email: gmailUserData?.email || '',
    passwd: '',
    confirmPassword: '',
    gen_per: '',
    dir_per: '',
    fec_nac_per: '',
    cel_per: gmailUserData?.cel_per || ''
  })

  // Vars 
  const legalAge = LegalAge()
  const navigate = useNavigate()

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

    if (!formData.cel_per.trim()) newErrors.cel_per = 'El celular es requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Form data:', formData)
      
      const log = false
      if (log) {
        setTimeout(() => {
          navigate(`${URL}/login`)
        })
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
            

            {/* Contraseña */}
            <div className={styles["form-group"]}>
              <label htmlFor="passwd" className={styles["form-label"]}>
                Contraseña <span className={styles["required"]}>*</span>
              </label>
              <input
                type="passwd"
                id="passwd"
                name="passwd"
                value={formData.passwd}
                onChange={handleChange}
                className={`${styles["form-input"]} ${errors.passwd ? styles["input-error"] : ''}`}
                placeholder="Ingresa tu contraseña"
              />
              {errors.passwd && <span className={styles["error-message"]}>{errors.passwd}</span>}
            </div>

            {/* Confirmar Contraseña */}
            <div className={styles["form-group"]}>
              <label htmlFor="confirmPassword" className={styles["form-label"]}>
                Confirmar Contraseña <span className={styles["required"]}>*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`${styles["form-input"]} ${errors.confirmPassword ? styles["input-error"] : ''}`}
                placeholder="Confirma tu contraseña"
              />
              {errors.confirmPassword && <span className={styles["error-message"]}>{errors.confirmPassword}</span>}
            </div>

            {/* Género */}
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
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
                <option value="prefer-not">Prefiero no decir</option>
              </select>
            </div>

            {/* Dirección */}
            <div className={styles["form-group"]}>
              <label htmlFor="dir_per" className={styles["form-label"]}>
                Dirección
              </label>
              <input
                type="text"
                id="dir_per"
                name="dir_per"
                value={formData.dir_per}
                onChange={handleChange}
                className={styles["form-input"]}
                placeholder="Ingresa tu dirección completa"
              />
            </div>

            {/* Fecha de Nacimiento */}
            <div className={styles["form-group"]}>
              <label htmlFor="fec_nac_per" className={styles["form-label"]}>
                Fecha de Nacimiento <span className={styles["required"]}>*</span>
              </label>
              {console.log('Legal Age:', legalAge)}
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

            {/* Celular */}
            <div className={styles["form-group"]}>
              <label htmlFor="cel_per" className={styles["form-label"]}>
                Celular <span className={styles["required"]}>*</span>
              </label>
              <input
                type="tel"
                id="cel_per"
                name="cel_per"
                value={formData.cel_per}
                onChange={handleChange}
                className={`${styles["form-input"]} ${errors.cel_per ? styles["input-error"] : ''}`}
                placeholder="Ingresa tu número de celular"
              />
              {errors.cel_per && <span className={styles["error-message"]}>{errors.cel_per}</span>}
            </div>
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