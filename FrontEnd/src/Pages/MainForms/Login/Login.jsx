// Librarys 
import React, { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useForm } from "react-hook-form"
import { Mail } from 'lucide-react';

// Imports
import { errorStatusHandler, showAlert, showAlertLoading } from '../../../Utils/utils'
import { AuthContext } from "../../../Contexts/Contexts"
import { auth } from "../../../Hooks/AuthFirebase"
import { PostData } from "../../../Utils/Requests";

// Import styles 
import styles from './login.module.css'

// Component 
export const LoginForm = ({ URL = '' }) => {
  // Dynamic Vars 
  const [ showPassword, setShowPassword ] = useState(false)

  // Vars 
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  // Form config 
  const { handleSubmit, register, formState: { errors } } = useForm({ mode: "onChange" })

  // Functions 
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    showAlertLoading('Cargando...', 'Por favor espera', 'info')
    try {
      const result = await signInWithPopup(auth, provider);
      // Esto te da un Google Access Token.
      // const credential = GoogleAuthProvider.credentialFromResult(result)
      // const googleToken = credential.accessToken

      // Map data 
      const user = result.user
      const userData = { 
        email: user?.email || '',
        nom_per: user?.displayName?.split(' ')?.[0] || '',
        ape_per: user?.displayName?.split(' ')?.[1] || '',
        cel_per: user?.phoneNumber,
        url_img: user?.photoURL || '',
      }

      // Login with google 
      const post = await PostData(`${URL}/credential/login-google`, userData)

      // Check log 
      if(post?.login) {
        showAlert('Éxito', 'Inicio de sesión exitoso', 'success')
        setTimeout(() => {
          navigate('/')
        }, 2000)
        return
      }

      // Encode Data 
      if (userData?.email) {
        const encode = await PostData(`${URL}/credential/JWT-encoder`, {
          content: JSON.stringify(userData),
          lifeTime: 8
        })
        
        if (encode) localStorage.setItem("gmailUserData", encode )
      }

      showAlert('Éxito', 'Completa tus datos para continuar', 'success')
      setTimeout(() => {
        navigate('/validate-data')
      }, 2000)
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  };

  const onSubmit = async ( data ) => {
    showAlertLoading('Cargando...', 'Por favor espera', 'info')
    try {
      const log = await login(`${URL}/credential/login`, { firstData: data.email, secondData: data.password })
      if (log) {
        showAlert('Éxito', 'Inicio de sesión exitoso', 'success')
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', String(message), 'error')
    }
  }

  return (
    <main className={styles["login-container"]}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles["login-form"]}>
        <h2 className={styles["login-title"]}>Iniciar Sesión</h2>
        
        <div className={styles["input-group"]}>
          <label htmlFor="email" className={styles["input-label"]}>Email</label>
          <input
            type="email"
            id="email"
            className={styles["input-field"]}
            placeholder="Correo electrónico"
            {...register('email', {
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
            autoFocus
          />
          {errors.email && (
            <p id="email-error" className='mensaje-error' role="alert" aria-live="assertive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className={styles["input-group"]}>
          <label htmlFor="password" className={styles["input-label"]}>Contraseña</label>
          <div className={styles["password-wrapper"]}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register('password', {
                required: 'Este campo es requerido',
                minLength: {
                  value: 8,
                  message: 'Debe contener minimo 8 characteres'
                },
                maxLength: {
                  value: 100,
                  message: 'Debe contener menos de 100 caracteres',
                },
              })}
              className={styles["input-field"]}
              placeholder="Contraseña"
              maxLength={100}
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
          {errors.password && (
            <p id="password-error" className='mensaje-error' role="alert" aria-live="assertive">
              {errors.password.message}
            </p>
          )}
        </div>

        <button type="submit" className={'primaryBtn expand'}>
          Ingresar
        </button>

        <footer className={styles["login-footer"]}>
          <span className={"a-text"}>
            <Link to="/forgot-password" className={"a-link"}>¿Olvidaste tu contraseña?</Link>
          </span>
          <span className={"a-text"}>
            ¿No tienes cuenta? <Link to="/signup" className={"a-link"}>Regístrate</Link>
          </span>
          <span className={styles["footer-text"]}>
            <button 
              type="button"
              className="backButton"
              onClick={signInWithGoogle}
            >
              <Mail />
              Iniciar Sesion con Google
            </button>
          </span>
        </footer>
      </form>
    </main>
  )
}