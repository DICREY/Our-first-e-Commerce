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
import { useForm } from 'react-hook-form'

// Component 
export const PasswordReset = ({ URL = '' }) => {
    // States 
    const [ email, setEmail ] = useState('')
    const [ code, setCode ] = useState('')
    const [ inputType, setInputType ] = useState('password')
    const [ inputTypeTwo, setInputTypeTwo ] = useState('password')
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

    // Form Config 
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" })

    // Send Request 
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
    const handleSendCode = async (data) => {
        setLoading(true)
        setError('')

        try {
            // Aquí implementas tu lógica para enviar el código
            const actionCodeSettings = {
                url: 'http://localhost:5173/forgot-password',
                handleCodeInApp: true
            }
            const got = await PostData(`${URL}/peoples/by`, { by: data.email })
            if (got?.[0]) {
                setCurrentUser(got?.[0])
                const verify = await showAlertSelect('Usuario encontrado', `¿Es usted ${got?.[0]?.nom_per} ${got?.[0]?.ape_per}?`)
                if (await verify?.isConfirmed) {
                    await sendPasswordResetEmail(auth, data.email, actionCodeSettings)
                    setSuccess(`Se ha enviado un correo a ${data.email}`)
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
    const handleResetPassword = async (data) => {
        setLoading(true)
        setError('')

        if (data.newPassword !== data.confirmPassword) {
            showAlert('Error','Las contraseñas no coinciden','error')
            setLoading(false)
            return
        }

        try {
            const reset = await confirmPasswordReset(auth, code, data.newPassword)
            if (reset) return
            
            await ChangePasswordRequest(data.newPassword)
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
                    <form onSubmit={handleSubmit(handleSendCode)} className={styles.form}>
                        <label htmlFor="email" className={styles.label}>Señor usuario digite su correo electrónico registrado en nuestro sistema</label>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                placeholder='Escriba su email'
                                className={styles.input}
                                {...register('email',{
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 8,
                                        message: 'Debe contener minimo 8 characteres'
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: 'Debe contener menos de 100 characteres'
                                    },
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'El correo es inválido',
                                    },
                                })}
                            />
                            {errors.email && (
                                <p id="email-error" className='mensaje-error' role="alert" aria-live="assertive">
                                {errors.email.message}
                                </p>
                            )}
                        </div>
                        <button type="submit" className={`backButton ${styles.button}`} disabled={loading}>
                            <Send />
                            {loading ? 'Enviando...' : 'Enviar Código'}
                        </button>
                    </form>
                )}

                {/* Paso 2: Ingresar código */}
                {step === 2 && (
                    <form onSubmit={handleSubmit(handleVerifyCode)} className={styles.form}>
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
                    <form onSubmit={handleSubmit(handleResetPassword)} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword" className={styles.label}>Nueva Contraseña</label>
                            <span
                                className={styles.inputSpan}
                            >
                                <input
                                    type={inputType}
                                    id="newPassword"
                                    placeholder='Nueva contraseña'
                                    {...register('newPassword', {
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
                                    style={{ background: 'transparent', border: 'none', outline: 'none' }}
                                    
                                />
                                <span
                                    onClick={() => setInputType(inputType === 'text'?'password':'text')}
                                >
                                    {inputType === 'text'? <LockKeyholeOpen />: <LockKeyhole />}
                                </span>
                            </span>
                            {errors.newPassword && (
                                <p id="newPassword-error" className='mensaje-error' role="alert" aria-live="assertive">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>Confirmar Contraseña</label>
                            <span
                                className={styles.inputSpan}
                            >
                                <input
                                    type={inputTypeTwo}
                                    id="confirmPassword"
                                    placeholder='Confirmar Contraseña'
                                    minLength="6"
                                    {...register('confirmPassword', {
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
                                <span
                                    onClick={() => setInputTypeTwo(inputTypeTwo === 'text'?'password':'text')}
                                >
                                    {inputTypeTwo === 'text'? <LockKeyholeOpen />: <LockKeyhole />}
                                </span>
                            </span>
                            {errors.confirmPassword && (
                                <p id="confirmPassword-error" className='mensaje-error' role="alert" aria-live="assertive">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
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