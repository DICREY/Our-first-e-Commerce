// Librarys
import React, { useState } from 'react'
import { sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth'
import { ChevronLeft, LoaderCircle, Mail, Send } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

// Imports 
import { auth } from '../../../Hooks/AuthFirebase'
import { PostData } from '../../../Utils/Requests'
import { showAlertSelect } from '../../../Utils/utils'

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
    const [currentUser, setCurrentUser] = useState(null)

    // vars 
    const navigate = useNavigate()

    // Paso 1: Enviar código al correo
    const handleSendCode = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Aquí implementas tu lógica para enviar el código
            const actionCodeSettings = {
                url: 'http://localhost:5173/forgot-password',
                handleCodeInApp: true
            }
            const got = await PostData(`${URL}/peoples/by`, { by: email })
            if (got?.[0]) {
                setCurrentUser(got?.[0])
                const verify = await showAlertSelect('Usuario encontrado', `¿Es usted ${got?.[0]?.nom_per} ${got?.[0]?.ape_per}?`)
                if (await verify?.isConfirmed) {
                    setStep(2)
                    const send = await sendPasswordResetEmail(auth, email, actionCodeSettings)
                    setSuccess(`Se ha enviado un código a ${email}`)
                } else navigate(-1)
            }
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
        <main className={styles.container}>
            <section className={styles.card}>
                <h2 className={styles.title}>Cambiar Contraseña</h2>

                {error && <div className={styles.alertError}>{error}</div>}
                {success && <div className={styles.alertSuccess}>{success}</div>}

                {/* Paso 1: Ingresar email */}
                {step === 1 && (
                    <form onSubmit={handleSendCode} className={styles.form}>
                        <label htmlFor="email" className={styles.label}>Señor usuario digite su correo electrónico registrado en nuestro sistema</label>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                placeholder='Escriba su email'
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>
                        <button type="submit" className={`backButton ${styles.button}`} disabled={loading}>
                            <Send />
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
                                placeholder='Código de verificación'
                                onChange={(e) => setCode(e.target.value)}
                                className={styles.input}
                                required
                            />
                            <small className={styles.helperText}>Revisa tu correo electrónico para obtener el código</small>
                        </div>
                        <button type="submit" className={`backButton ${styles.button}`} disabled={loading}>
                            {loading ? 
                                (<><LoaderCircle />Verificando...</>): 
                                (<><Mail /> Verificar Código</>)
                            }
                        </button>
                        <span>
                            <button 
                                type="button"
                                className={`backButton ${styles.button}`}
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                <ChevronLeft />
                                Atrás
                            </button>
                            <button 
                                type="button"
                                className={`backButton ${styles.button}`}
                                onClick={handleSendCode}
                                disabled={loading}
                            >
                                <Send />
                                Reenviar Código
                            </button>
                        </span>
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
                                placeholder='Nueva contraseña'
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
                                placeholder='Confirmar Contraseña'
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
                <span className={"a-text"}>
                    <Link
                        to={'/login'}
                        className={"a-link"}
                    >
                        Iniciar de sesión
                    </Link>
                </span>
            </section>
        </main>
    )
}