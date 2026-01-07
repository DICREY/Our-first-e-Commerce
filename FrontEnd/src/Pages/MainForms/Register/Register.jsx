// Librarys 
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

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

  // Functions
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
      <form onSubmit={handleSubmit} className={styles.registerForm}>
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
              value={formData.nom_per}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="ape_per" className={styles.inputLabel}>Apellidos*</label>
            <input
              type="text"
              id="ape_per"
              name="ape_per"
              placeholder="Apellidos"
              value={formData.ape_per}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
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
              value={formData.fec_nac_per}
              max={legalAge}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
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
            value={formData.email_per}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="pas_per" className={styles.inputLabel}>Contraseña*</label>
          <div className={styles["password-wrapper"]}>
            <input
              type={showPassword ? "text" : "password"}
              id="pas_per"
              name="pas_per"
              placeholder="Contraseña"
              value={formData.pas_per}
              onChange={handleChange}
              className={styles.inputField}
              required
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