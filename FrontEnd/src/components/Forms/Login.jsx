// Librarys 
import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

// Imports
import { PostData } from '../../Utils/Requests'
import { errorStatusHandler } from '../../Utils/utils'
import { AuthContext } from "../../Contexts/Contexts"

// Import styles 
import styles from '../../styles/Forms/login.module.css'

// Component 
export const LoginForm = ({ URL = '' }) => {
  // Dynamic Vars 
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")

  // Vars 
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const log = await login(`${URL}/credential/login`, { firstData: email, secondData: password })
        if (log) {
          navigate('/')
        }
    } catch (err) {
        const message = errorStatusHandler(err)
        console.log(message)
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

        <button type="submit" className={styles["login-button"]}>
          Ingresar
        </button>

        <div className={styles["login-footer"]}>
          <a href="/forgot-password" className={styles["footer-link"]}>¿Olvidaste tu contraseña?</a>
          <span className={styles["footer-text"]}>
            ¿No tienes cuenta? <a href="/signup" className={styles["footer-link"]}>Regístrate</a>
          </span>
        </div>
      </form>
    </main>
  )
}