// Librarys
import React, { useState } from 'react'
import { sendPasswordResetEmail, confirmPasswordReset, getAuth } from 'firebase/auth'
import { auth } from '../../../Hooks/AuthFirebase'

// Import styles 
import styles from '../../../styles/Pages/MainForms/PasswordReset.module.css'

// Component 
export const PasswordReset = ({ URL = '' }) => {
    // States 
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [step, setStep] = useState(1) // 1: Email, 2: Code, 3: New Password
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    // Paso 1: Enviar código al correo
    const handleSendCode = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Aquí implementas tu lógica para enviar el código
            // Ejemplo con Firebase:
            const actionCodeSettings = {
                url: 'http://localhost:5173/forgot-password',
                handleCodeInApp: true
            }
            const send = await sendPasswordResetEmail(auth, email, actionCodeSettings)
            console.log(send)

            setSuccess(`Se ha enviado un código a ${email}`)
            setStep(2)
        } catch (err) {
            setError(err.message || 'Error al enviar el código')
        } finally {
            setLoading(false)
        }
    }

    // Paso 2: Verificar código
    const handleVerifyCode = (e) => {
        e.preventDefault()
        // Aquí normalmente verificarías el código con tu backend
        // Por ahora solo avanzamos al siguiente paso
        setStep(3)
        setSuccess('Código verificado correctamente')
    }

    // Paso 3: Cambiar contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        try {
            // Aquí implementas la lógica para cambiar la contraseña
            // Ejemplo con Firebase (necesitas el código de verificación):
            await confirmPasswordReset(auth, code, newPassword)

            // Simulación de éxito:
            setSuccess('Contraseña cambiada exitosamente')
            setTimeout(() => {
                // Redirigir al login o dashboard
            }, 2000)
        } catch (err) {
            setError(err.message || 'Error al cambiar la contraseña')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Cambiar Contraseña</h2>

                {error && <div className={styles.alertError}>{error}</div>}
                {success && <div className={styles.alertSuccess}>{success}</div>}

                {/* Paso 1: Ingresar email */}
                {step === 1 && (
                    <form onSubmit={handleSendCode} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Código'}
                        </button>
                    </form>
                )}

                {/* Paso 2: Ingresar código */}
                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="code" className={styles.label}>Código de Verificación</label>
                            <input
                                type="text"
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className={styles.input}
                                required
                            />
                            <small className={styles.helperText}>Revisa tu correo electrónico para obtener el código</small>
                        </div>
                        <button 
                            type="button"
                            className={styles.button}
                            onClick={handleSendCode}
                            disabled={loading}
                        >
                            Reenviar Código
                        </button>
                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? 'Verificando...' : 'Verificar Código'}
                        </button>
                    </form>
                )}

                {/* Paso 3: Nueva contraseña */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword" className={styles.label}>Nueva Contraseña</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={styles.input}
                                minLength="6"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>Confirmar Contraseña</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.input}
                                minLength="6"
                                required
                            />
                        </div>
                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}