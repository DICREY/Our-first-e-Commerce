// Librarys 
import React, { useState } from "react"

// Imports 
import { PostData } from "../../Utils/Requests"
import { errorStatusHandler, showAlert, showAlertLoading } from "../../Utils/utils"

// Import styles 
import styles from '../../styles/Forms/register.module.css'

// Component 
export const RegisterForm = ({ URL = '' }) => {
  const [formData, setFormData] = useState({
    nom: "",
    ape: "",
    fec_nac: "",
    tip_doc: "CC", // Valor por defecto
    doc: "",
    dir: "",
    cel: "",
    cel2: "",
    email: "",
    pas_per: "",
    gen: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Datos enviados:", formData)
    showAlertLoading('Cargando...', 'Por favor espera', 'info')
    try {
        const req = await PostData(`${URL}/credential/login`, {})
        console.log(req)
        if (req) {
            showAlert('Éxito', 'Registro exitoso', 'success')
            setTimeout(() => {
              window.location.href = '/login'
            }, 3000)
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

        {/* Nombre y Apellido */}
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="nom" className={styles.inputLabel}>Nombres*</label>
            <input
              type="text"
              id="nom"
              name="nom"
              placeholder="Nombres"
              value={formData.nom}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="ape" className={styles.inputLabel}>Apellidos*</label>
            <input
              type="text"
              id="ape"
              name="ape"
              placeholder="Apellidos"
              value={formData.ape}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
          </div>
        </div>

        {/* Fecha de Nacimiento y Género */}
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="fec_nac" className={styles.inputLabel}>Fecha de Nacimiento*</label>
            <input
              type="date"
              id="fec_nac"
              name="fec_nac"
              value={formData.fec_nac}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="gen" className={styles.inputLabel}>Género</label>
            <select
              id="gen"
              name="gen"
              value={formData.gen}
              onChange={handleChange}
              className={styles.inputField}
            >
              <option value="">Seleccionar</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        {/* Tipo de Documento y Número */}
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="tip_doc" className={styles.inputLabel}>Tipo de Documento*</label>
            <select
              id="tip_doc"
              name="tip_doc"
              value={formData.tip_doc}
              onChange={handleChange}
              className={styles.inputField}
              required
            >
              <option value="CC">CC</option>
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Carnet Extranjería">Carnet de Extranjería</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="doc" className={styles.inputLabel}>Número de Documento*</label>
            <input
              type="text"
              id="doc"
              name="doc"
              placeholder="Numero Documento"
              value={formData.doc}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
          </div>
        </div>

        {/* Dirección */}
        <div className={styles.inputGroup}>
          <label htmlFor="dir" className={styles.inputLabel}>Dirección*</label>
          <input
            type="text"
            id="dir"
            name="dir"
            placeholder="Dirección de residencia"
            value={formData.dir}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
        </div>

        {/* Teléfonos */}
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="cel" className={styles.inputLabel}>Celular Principal*</label>
            <input
              type="tel"
              id="cel"
              name="cel"
              placeholder="Numero de celular"
              value={formData.cel}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="cel2" className={styles.inputLabel}>Celular Secundario</label>
            <input
              type="tel"
              id="cel2"
              name="cel2"
              placeholder="Numero de Celular secundario"
              value={formData.cel2}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
        </div>

        {/* Email y Contraseña */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.inputLabel}>Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="pas_per" className={styles.inputLabel}>Contraseña*</label>
          <input
            type="password"
            id="pas_per"
            name="pas_per"
            placeholder="Contraseña"
            value={formData.pas_per}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
        </div>

        <button type="submit" className={styles.registerButton}>
          Registrarse
        </button>
        <span className={"footer-text"}>
            ¿No tienes cuenta? <a href="/login" className={"footer-link"}>Ingresar</a>
        </span>
      </form>
    </main>
  )
}