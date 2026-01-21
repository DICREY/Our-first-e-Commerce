// Librarys
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

// Imports 
import { decodeJWT, errorStatusHandler, LegalAge, showAlert, showAlertLoading } from "../../../Utils/utils"
import { PostData } from "../../../Utils/Requests"

// Import styles
import styles from './ValidateUserData.module.css'
import { useForm } from "react-hook-form"

// Component
export const ValidateData = ({ URL = '' }) => {
  // Vars
  const legalAge = LegalAge()
  const navigate = useNavigate()
  const gmailUserData = decodeJWT(localStorage.getItem('gmailUserData'))

  // Dynamic Vars
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

  // Form Config 
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ 
    mode: 'onChange',
    defaultValues: {
      email: gmailUserData?.email || '',
      passwd: '',
      confirmPassword: '',
      gen_per: '',
      fec_nac_per: '',
      nom_per: gmailUserData?.nom_per || '',
      ape_per: gmailUserData?.ape_per || '',
      img: gmailUserData?.url_img || '',
      theme: gmailUserData?.theme || 'LIGHT'
    }
  })

  const passwordValue = watch('passwd')

  // Functions
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const onSubmit = async (data) => {
    showAlertLoading('Cargando...', 'Por favor espere', 'info')
    try {        
      const post = await PostData(`${URL}/credential/login-google`, { 
        requestState: '2',
        ...data
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

  return (
    <main className={styles["form-container"]}>
      <div className={styles["form-wrapper"]}>
        <div className={styles["form-header"]}>
          <h1 className={styles["form-title"]}>Completar Datos</h1>
          <p className={styles["form-subtitle"]}>Por favor completa todos los campos requeridos</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
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
                  placeholder="Ingresa tu Nombre"
                  className={`${styles["form-input"]} ${errors.nom_per ? styles["input-error"] : ''}`}
                  {...register('nom_per', {
                    required: 'El nombre es requerido',
                    minLength: {
                      value: 2,
                      message: 'El nombre debe tener al menos 2 caracteres'
                    },
                    maxLength: {
                      value: 50,
                      message: 'El nombre no puede exceder 50 caracteres'
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message: 'El nombre solo puede contener letras'
                    }
                  })}
                />
                {errors.nom_per && <span className={styles["error-message"]}>{errors.nom_per.message}</span>}
              </div>
            )}

            {/* Apellido */}
            {!gmailUserData?.ape_per && (
              <div className={styles["form-group"]}>
                <label htmlFor="ape_per" className={styles["form-label"]}>
                  Apellido
                </label>
                <input
                  type="text"
                  id="ape_per"
                  placeholder="Ingresa tu Apellido"
                  className={`${styles["form-input"]} ${errors.ape_per ? styles["input-error"] : ''}`}
                  {...register('ape_per', {
                    required: 'El apellido es requerido',
                    minLength: {
                      value: 2,
                      message: 'El apellido debe tener al menos 2 caracteres'
                    },
                    maxLength: {
                      value: 50,
                      message: 'El apellido no puede exceder 50 caracteres'
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message: 'El apellido solo puede contener letras'
                    }
                  })}
                />
                {errors.ape_per && <span className={styles["error-message"]}>{errors.ape_per.message}</span>}
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
                  placeholder="Ingresa tu contraseña"
                  className={`${styles["form-input"]} ${errors.passwd ? styles["input-error"] : ''}`}
                  {...register('passwd', {
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres'
                    },
                    maxLength: {
                      value: 100,
                      message: 'La contraseña no puede exceder 100 caracteres'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                      message: 'Debe contener mayúsculas, minúsculas, números y caracteres especiales'
                    },
                  })}
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
              {errors.passwd && <span className={styles["error-message"]}>{errors.passwd.message}</span>}
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
                  placeholder="Confirma tu contraseña"
                  className={`${styles["form-input"]} ${errors.confirmPassword ? styles["input-error"] : ''}`}
                  {...register('confirmPassword', {
                    required: 'La confirmación de contraseña es requerida',
                    minLength: {
                      value: 8,
                      message: 'Debe contener minimo 8 caracteres'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Debe contener menos de 100 caracteres'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                      message: 'Debe contener mayúsculas, minúsculas, números y caracteres especiales'
                    },
                    validate: (value) => 
                      value === passwordValue || 'Las contraseñas no coinciden'
                  })}
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
              {errors.confirmPassword && (
                <span className={styles["error-message"]}>{errors.confirmPassword.message}</span>
              )}
            </div>

            {/* Género */}
            {!gmailUserData?.gen_per && (
              <div className={styles["form-group"]}>
                <label htmlFor="gen_per" className={styles["form-label"]}>
                  Género
                </label>
                <select
                  id="gen_per"
                  className={styles["form-select"]}
                  {...register('gen_per', {
                    required: 'El género es requerido'
                  })}
                >
                  <option value="">Selecciona tu género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Other">Otro</option>
                  <option value="Prefer-not">Prefiero no decir</option>
                </select>
                {errors.gen_per && <span className={styles["error-message"]}>{errors.gen_per.message}</span>}
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
                  className={`${styles["form-input"]} ${errors.fec_nac_per ? styles["input-error"] : ''}`}
                  {...register('fec_nac_per', {
                    required: 'La fecha de nacimiento es requerida',
                    validate: (value) => {
                      if (value > legalAge) {
                        return 'Debes ser mayor de edad'
                      }
                      return true
                    },
                    min: {
                      value: '1900-01-01',
                      message: 'La fecha de nacimiento no puede ser anterior a 1900-01-01'
                    },
                    max: {
                      value: legalAge,
                      message: 'Debes ser mayor de edad'
                    }
                  })}
                  />
                {errors.fec_nac_per && <span className={styles["error-message"]}>{errors.fec_nac_per.message}</span>}
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