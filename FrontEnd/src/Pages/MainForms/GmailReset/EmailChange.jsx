// Librarys 
import React, { useEffect, useState } from 'react'
import { sendEmailVerification, signInWithEmailAndPassword, updateEmail } from 'firebase/auth'
import { Navigate } from 'react-router-dom'

// Imports 
import { auth } from '../../../Hooks/AuthFirebase'
import { errorStatusHandler, showAlert } from '../../../Utils/utils'
import { ModifyData, PostData } from '../../../Utils/Requests'

// Import styles 
import styles from './EmailChange.module.css'

// Component 
export const EmailChange = ({ URL = "" }) => {
  // Vars 
  const params = new URLSearchParams(window.location.search)
  const apiKey = params.get('apiKey')
  const em = params.get('em')
  const oobCode = params.get('oobCode')
  let didFetch = false

  // Dynamic vars
  const [ loading, setLoading ] = useState(false)
  const [ errors, setErrors ] = useState({})
  const [ success, setSuccess ] = useState(false)
  const [ currentUser, setCurrentUser ] = useState()
  const [ formData, setFormData ] = useState({
    currentEmail: em || '',
    newEmail: '',
    confirmEmail: '',
    password: ''
  })

  const getUser = async () => {
    if (didFetch) return
    didFetch = true
    try {
      const got = await PostData(`${URL}/peoples/by`, { by: em })
      if (got?.[0]) setCurrentUser(got[0])
    } catch (error) {
      const message = errorStatusHandler(error)
      showAlert('Error', message, 'error')
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.newEmail) {
      newErrors.newEmail = 'El nuevo correo es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.newEmail)) newErrors.newEmail = 'Formato de correo inválido'
    if (formData.newEmail !== formData.confirmEmail) newErrors.confirmEmail = 'Los correos no coinciden'
    if (!formData.password) newErrors.password = 'La contraseña es requerida'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      // Update email using Firebase Auth
      if (currentUser?.verificado && currentUser?.auth_provider === "GOOGLE") {
        // 1. Inicia sesión y reautentica
        const verifyCredential = await signInWithEmailAndPassword(auth, em, formData.password)
        const credential = EmailAuthProvider.credential(em, formData.password)
        await reauthenticateWithCredential(auth.currentUser, credential)

        // 2. Cambia el correo
        await updateEmail(auth.currentUser, formData.newEmail)

        // 3. Envía email de verificación al nuevo correo
        await sendEmailVerification(auth.currentUser)

        showAlert('Éxito', 'Correo actualizado exitosamente. Por favor vuelve a iniciar sesión para continuar.', 'success')
      } else {
        const mod = await ModifyData(`${URL}/peoples/change-email`, {
          oldEmail: em,
          newEmail: formData.newEmail
        })

        if (mod?.success) {
          showAlert('Éxito', 'Correo actualizado exitosamente. Por favor vuelve a iniciar sesión para continuar.', 'success')
        }
      }
      setTimeout(() => <Navigate to="/login" />, 2000)
    } catch (error) {
      const message = errorStatusHandler(error)
      showAlert('Error', message, 'error')
      setErrors({ submit: message })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Cambiar Correo Electrónico</h2>
        <p className={styles.subtitle}>
          Actualiza tu dirección de correo electrónico asociada a tu cuenta
        </p>
      </header>

      <section className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Current Email Display */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Correo actual</label>
            <div className={styles.currentEmail}>
              {em || 'No disponible'}
            </div>
          </div>

          {/* New Email */}
          <div className={styles.formGroup}>
            <label htmlFor="newEmail" className={styles.label}>
              Nuevo correo electrónico
            </label>
            <input
              type="email"
              id="newEmail"
              name="newEmail"
              value={formData.newEmail}
              onChange={handleChange}
              className={errors.newEmail ? styles.inputError : styles.input}
              placeholder="nuevo@correo.com"
              disabled={loading}
            />
            {errors.newEmail && (
              <span className={styles.errorMessage}>{errors.newEmail}</span>
            )}
          </div>

          {/* Confirm Email */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmEmail" className={styles.label}>
              Confirmar nuevo correo
            </label>
            <input
              type="email"
              id="confirmEmail"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              className={errors.confirmEmail ? styles.inputError : styles.input}
              placeholder="nuevo@correo.com"
              disabled={loading}
            />
            {errors.confirmEmail && (
              <span className={styles.errorMessage}>{errors.confirmEmail}</span>
            )}
          </div>

          {/* Password Verification */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña actual
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.inputError : styles.input}
              placeholder="Ingresa tu contraseña actual"
              disabled={loading}
            />
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className={styles.errorBanner}>
              {errors.submit}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className={styles.successBanner}>
              ✓ Correo electrónico actualizado exitosamente
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className="deleteButton"
              onClick={() => setFormData({
                currentEmail: currentEmail,
                newEmail: '',
                confirmEmail: '',
                password: ''
              })}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="primaryBtn"
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Actualizar Correo'}
            </button>
          </div>
        </form>
      </section>

      {/* Security Notice */}
      {/* <footer className={styles.securityNotice}>
        <h4 className={styles.securityTitle}>⚠️ Importante</h4>
        <ul className={styles.securityList}>
          <li className={styles.securityItem}>Se enviará un email de verificación a tu nueva dirección</li>
          <li className={styles.securityItem}>Debes verificar el nuevo correo para completar el cambio</li>
          <li className={styles.securityItem}>Tu dirección actual seguirá activa hasta que verifiques la nueva</li>
        </ul>
      </footer> */}
    </main>
  )
}