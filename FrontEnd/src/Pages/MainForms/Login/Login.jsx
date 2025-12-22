// Librarys 
import React, { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { Mail } from 'lucide-react';

// Imports
import { errorStatusHandler, showAlert, showAlertLoading } from '../../../Utils/utils'
import { AuthContext } from "../../../Contexts/Contexts"
import { auth } from "../../../Hooks/AuthFirebase"

// Import styles 
import styles from './login.module.css'

// Component 
export const LoginForm = ({ URL = '', setGmailUserData = null }) => {
  // Dynamic Vars 
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")

  // Vars 
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  // Functions 
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Esto te da un Google Access Token.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      const user = result.user
      const pass = `Password_${user?.displayName?.split(' ')?.[0]?.toLowerCase()}*`
      const userData = { 
        email: user?.email || '',
        nom_per: user?.displayName?.split(' ')?.[0] || '',
        ape_per: user?.displayName?.split(' ')?.[1] || '',
        cel_per: user?.phoneNumber,
        passwd: pass || 'Password123*',
        url_img: user?.photoURL || '',
      }

      showAlertLoading('Cargando...', 'Por favor espera', 'info')
      showAlert('Éxito', 'Completa tus datos para continuar', 'success')
      console.log('GMAIL USER DATA:', gmailUserData)
      gmailUserData?? setGmailUserData(userData)
      setTimeout(() => {
        navigate(`${URL}/credential/validate-data/`)
      }, 2000)
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    showAlertLoading('Cargando...', 'Por favor espera', 'info')
    try {
        const log = await login(`${URL}/credential/login`, { firstData: email, secondData: password })
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
      <form onSubmit={handleSubmit} className={styles["login-form"]}>
        <h2 className={styles["login-title"]}>Iniciar Sesión</h2>
        
        <div className={styles["input-group"]}>
          <label htmlFor="email" className={styles["input-label"]}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles["input-field"]}
            placeholder="Correo electrónico"
            required
          />
        </div>

        <div className={styles["input-group"]}>
          <label htmlFor="password" className={styles["input-label"]}>Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles["input-field"]}
            placeholder="Contraseña"
            required
          />
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