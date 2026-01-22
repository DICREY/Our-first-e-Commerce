// Librarys 
import React, { useEffect, useState } from 'react'
import { sendEmailVerification, signInWithEmailAndPassword, updateEmail } from 'firebase/auth'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

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
  const [ success, setSuccess ] = useState(false)
  const [ currentUser, setCurrentUser ] = useState()

  // Form config 
  const { register, getValues, reset, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' })

  // Get info of current user
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

  // Send Request 
  const onSubmit = async (data) => {
    setLoading(true)

    try {
      // Update email using Firebase Auth
      if (currentUser?.verificado && currentUser?.auth_provider === "GOOGLE") {
        // 1. Inicia sesión y reautentica
        const verifyCredential = await signInWithEmailAndPassword(auth, em, data.password)
        const credential = EmailAuthProvider.credential(em, data.password)
        await reauthenticateWithCredential(auth.currentUser, credential)

        // 2. Cambia el correo
        await updateEmail(auth.currentUser, data.newEmail)

        // 3. Envía email de verificación al nuevo correo
        await sendEmailVerification(auth.currentUser)

        showAlert('Éxito', 'Correo actualizado exitosamente. Por favor vuelve a iniciar sesión para continuar.', 'success')
      } else {
        const mod = await ModifyData(`${URL}/peoples/change-email`, {
          oldEmail: em,
          newEmail: data.newEmail
        })

        if (mod?.success) {
          showAlert('Éxito', 'Correo actualizado exitosamente. Por favor vuelve a iniciar sesión para continuar.', 'success')
        }
      }
      setTimeout(() => <Navigate to="/login" />, 2000)
    } catch (error) {
      const message = errorStatusHandler(error)
      showAlert('Error', message, 'error')
    } finally {
      setLoading(false)
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
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
              className={errors.newEmail ? styles.inputError : styles.input}
              placeholder="nuevo correo electrónico"
              disabled={loading}
              {...register('newEmail', {
                required: 'El nuevo correo es obligatorio',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Formato de correo inválido'
                },
                validate: value =>
                  value !== em || 'El nuevo correo no puede ser igual al actual',
                maxLength: {
                  value: 100,
                  message: 'El correo no puede exceder los 100 caracteres'
                },
                minLength: {
                  value: 8,
                  message: 'El correo debe tener al menos 8 caracteres'
                }
              })}

            />
             {errors.newEmail && (
              <p id="newEmail-error" className='mensaje-error' role="alert" aria-live="assertive">
                {errors.newEmail.message}
              </p>
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
              className={errors.confirmEmail ? styles.inputError : styles.input}
              placeholder="confirma tu nuevo correo electrónico"
              disabled={loading}
              {...register('confirmEmail', {
                required: 'La confirmación de correo es obligatoria',
                validate: value =>
                  value === getValues('newEmail') || 'Los correos no coinciden'
              })}
            />
            {errors.confirmEmail && (
                <p id="confirmEmail-error" className='mensaje-error' role="alert" aria-live="assertive">
                {errors.confirmEmail.message}
                </p>
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
              className={errors.password ? styles.inputError : styles.input}
              placeholder="Ingresa tu contraseña actual"
              disabled={loading}
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres'
                },
                maxLength: {
                  value: 100,
                  message: 'La contraseña no puede exceder los 100 caracteres'
                }
              })}
            />
            {errors.password && (
                <p id="password-error" className='mensaje-error' role="alert" aria-live="assertive">
                {errors.password.message}
                </p>
            )}
          </div>

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
              onClick={reset}
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