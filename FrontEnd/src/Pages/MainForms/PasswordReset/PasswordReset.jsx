// Librarys
import React, { useEffect, useState } from 'react'
import { sendPasswordResetEmail, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { LockKeyhole, LockKeyholeOpen, Send } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

// Imports 
import { auth } from '../../../Hooks/AuthFirebase'
import { ModifyData, PostData } from '../../../Utils/Requests'
import { errorStatusHandler, FirebaseErrorHandler, showAlert, showAlertSelect } from '../../../Utils/utils'

// Import styles 
import styles from './PasswordReset.module.css'

// Component 
export const PasswordReset = ({ URL = '' }) => {
    // States 
    const [ email, setEmail ] = useState('')
    const [ code, setCode ] = useState('')
    const [ inputType, setInputType ] = useState('password')
    const [ inputTypeTwo, setInputTypeTwo ] = useState('password')
    const [ newPassword, setNewPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ step, setStep ] = useState(1) // 1: Email, 2: New Password
    const [ methodOther, setMethodOther ] = useState(1)
    const [ error, setError ] = useState('')
    const [ success, setSuccess ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ currentUser, setCurrentUser ] = useState(null)

    // vars 
    const navigate = useNavigate()
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    let didConfirmCode = false

    const ChangePasswordRequest = async (pwd = '') => {
        try {
            const modPwd = await ModifyData(`${URL}/credential/change-password`,{
                email: email,
                password: pwd
            })
            if (modPwd?.success) {
                showAlert('Contraseña cambiada','Su contraseña a sido cambiada satisfactoriamente','success')
                setTimeout(() => navigate('/login'), 2000)
            }
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error',message, 'error')
        } finally {
            setLoading(false)
        }
    }

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
                    await sendPasswordResetEmail(auth, email, actionCodeSettings)
                    setSuccess(`Se ha enviado un correo a ${email}`)
                } else navigate(-1)
            }
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
            setError(err.message || 'Error al enviar el código')
        } finally {
            setLoading(false)
        }
    }

    const ConfirmCodeReset = async (code) => {
        if (didConfirmCode) return
        didConfirmCode = true
        try {
            const resetCode = await verifyPasswordResetCode(auth, code)
            if (resetCode) setStep(3)
        } catch (err) {
            didConfirmCode = true
            const message = FirebaseErrorHandler(err)
            showAlert('Error', message, 'error')
        }
    }

    // Paso 2: Cambiar contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (newPassword !== confirmPassword) {
            showAlert('Error','Las contraseñas no coinciden','error')
            setLoading(false)
            return
        }

        try {
            const reset = await confirmPasswordReset(auth, code, newPassword)
            if (reset) return
            
            await ChangePasswordRequest(newPassword)
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error',message, 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyCode = () => {
        return
    }

    useEffect(() => {
        const tokenReset = params.get('apiKey')
        if (tokenReset) {
            setCode(params.get('oobCode'))
            setEmail(params.get('em'))
            ConfirmCodeReset(params.get('oobCode'))
        }
    },[])

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
                            placeholder='Código de verificación'
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={styles.input}
                            required
                        />
                        <small className={styles.helperText}>Revisa tu celular para obtener el código</small>
                    </div>
                    <button type="submit" className={`backButton ${styles.button}`} disabled={loading}>
                        {loading ? 'Verificando...' : 'Verificar Código'}
                    </button>
                    </form>
                )}

                {/* Paso 3: Nueva contraseña */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword" className={styles.label}>Nueva Contraseña</label>
                            <span
                                className={styles.inputSpan}
                            >
                                <input
                                    type={inputType}
                                    id="newPassword"
                                    placeholder='Nueva contraseña'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', outline: 'none' }}
                                    minLength="6"
                                    required
                                />
                                <span
                                    onClick={() => setInputType(inputType === 'text'?'password':'text')}
                                >
                                    {inputType === 'text'? <LockKeyholeOpen />: <LockKeyhole />}
                                </span>
                            </span>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>Confirmar Contraseña</label>
                            <span
                                className={styles.inputSpan}
                            >
                                <input
                                    type={inputTypeTwo}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    placeholder='Confirmar Contraseña'
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    minLength="6"
                                    required
                                />
                                <span
                                    onClick={() => setInputTypeTwo(inputTypeTwo === 'text'?'password':'text')}
                                >
                                    {inputTypeTwo === 'text'? <LockKeyholeOpen />: <LockKeyhole />}
                                </span>
                            </span>
                        </div>
                        <button type="submit" className={`backButton ${styles.button}`} disabled={loading}>
                            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                        </button>
                    </form>
                )}

                <footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className={"a-text"}>
                        <button
                            className={"a-link"}
                            onClick={() => showAlert('','No sirve papi te me calmas!!','info')}
                        >
                            Probar otro metodo
                        </button>
                    </span>
                    <span className={"a-text"}>
                        <Link
                            to='/login'
                            className={"a-link"}
                        >
                            Inicio de sesión
                        </Link>
                    </span>
                </footer>
            </section>
        </main>
    )
}