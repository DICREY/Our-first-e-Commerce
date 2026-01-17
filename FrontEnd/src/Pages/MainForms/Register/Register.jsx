// Librarys 
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

// Imports 
import { PostData } from "../../../Utils/Requests"
import { errorStatusHandler, LegalAge, showAlert, showAlertLoading } from "../../../Utils/utils"

// Import styles 
import styles from './register.module.css'

// Component 
export const RegisterForm = ({ URL = '' }) => {
  // Dynamic Vars 
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nom_per: "",
    ape_per: "",
    fec_nac_per: "",
    email_per: "",
    pas_per: "",
    gen_per: "",
    theme: "LIGHT"
  })

  // Vars
  const legalAge = LegalAge()
  const navigate = useNavigate()

  // Form config 
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' })

  // Functions
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Request 
  const onSubmit = async (data) => {
    console.log(data)
    showAlertLoading('Cargando...', 'Por favor espera', 'info')
    try {
      const req = await PostData(`${URL}/credential/register`, formData)
      if (req.success) {
          showAlert('Éxito', 'Registro exitoso', 'success')
          setTimeout(() => navigate('/login'), 3000)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', String(message), 'error')
    }
  }

  return (
    <main className={styles.registerContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.registerForm}>
        <h2 className={styles.registerTitle}>Registro de Usuario</h2>

        {/* Nombres y Apellidos */}
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="nom_per" className={styles.inputLabel}>Nombres*</label>
            <input
              type="text"
              id="nom_per"
              name="nom_per"
              placeholder="Nombres"
              className={styles.inputField}
              {...register('nom_per', {
                required: 'Este campo es requerido',
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
            {errors.nom_per && (
              <p id="nom_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                {errors.nom_per.message}
              </p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="ape_per" className={styles.inputLabel}>Apellidos*</label>
            <input
              type="text"
              id="ape_per"
              name="ape_per"
              placeholder="Apellidos"
              className={styles.inputField}
              {...register('ape_per', {
                required: 'Este campo es requerido',
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
            {errors.ape_per && (
              <p id="ape_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                {errors.ape_per.message}
              </p>
            )}
          </div>
        </div>

        {/* Fecha de Nacimiento y Género */}
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="fec_nac_per" className={styles.inputLabel}>Fecha de Nacimiento*</label>
            <input
              type="date"
              id="fec_nac_per"
              name="fec_nac_per"
              max={legalAge}
              className={styles.inputField}
              {...register('fec_nac_per', {
                required: 'Este campo es requerido',
                max: {
                  value: legalAge,
                  message: 'Debe ser mayor de edad'
                }
              })}
            />
            {errors.fec_nac_per && (
              <p id="fec_nac_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                {errors.fec_nac_per.message}
              </p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="gen_per" className={styles.inputLabel}>Género</label>
            <select
              id="gen_per"
              name="gen_per"
              value={formData.gen_per}
              onChange={handleChange}
              className={styles.inputField}
            >
              <option value="">Selecciona tu género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Other">Otro</option>
              <option value="Prefer-not">Prefiero no decir</option>
            </select>
          </div>
        </div>

        {/* Email y Contraseña */}
        <div className={styles.inputGroup}>
          <label htmlFor="email_per" className={styles.inputLabel}>Email*</label>
          <input
            type="email"
            id="email_per"
            name="email_per"
            placeholder="Correo electrónico"
            className={styles.inputField}
            required
            {...register('email_per', {
                required: 'Este campo es requerido',
                minLength: {
                  value: 8,
                  message: 'Debe contener al menos 8 caracteres',
                },
                maxLength: {
                  value: 100,
                  message: 'Debe contener menos de 100 caracteres',
                },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Este correo es inválido'
                }
              })}
            />
            {errors.email_per && (
              <p id="email_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                {errors.email_per.message}
              </p>
            )}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="pas_per" className={styles.inputLabel}>Contraseña*</label>
          <div className={styles["password-wrapper"]}>
            <input
              type={showPassword ? "text" : "password"}
              id="pas_per"
              name="pas_per"
              placeholder="Contraseña"
              className={styles.inputField}
              {...register('pas_per', {
                required: 'Este campo es requerido',
                minLength: {
                  value: 8,
                  message: 'Debe contener minimo 8 characteres'
                },
                maxLength: {
                  value: 100,
                  message: 'Debe contener menos de 100 characteres'
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
          {errors.pas_per && (
            <p id="pas_per-error" className='mensaje-error' role="alert" aria-live="assertive">
                {errors.pas_per.message}
            </p>
          )}
        </div>

        <button type="submit" className={"primaryBtn"}>
          Registrarse
        </button>
        <footer>
          <span className={"a-text"}>
              ¿No tienes cuenta? <Link to="/login" className='a-link'>Ingresar</Link>
          </span>
        </footer>
      </form>
    </main>
  )
}