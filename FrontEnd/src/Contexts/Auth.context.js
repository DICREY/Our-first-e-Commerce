// Librarys 
import React, { useState, useEffect } from 'react'

// Imports 
import { decodeJWT } from '../Utils/utils'
import { PostCookie } from '../Utils/Requests'
import { AuthContext } from './Contexts'
import AdminLoadingScreen from '../components/Global/Loading'

// Component
export const AuthProvider = ({ children }) => {
    // Dynamic vars
    const [ user, setUser ] = useState(null)
    const [ roles, setRoles ] = useState(null)
    const [ mainRol, setMainRol ] = useState(null)
    const [ theme, setTheme ] = useState('DARK')
    const [ admin, setAdmin ] = useState(false)
    const [ img, setImg ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    // Vars 
    let didFetch = false

    // Functions
    // Iniciar sesion 
    const login = async (url = '', data = {}) => {
        if (didFetch) return
        try {            
            const response = await PostCookie(url, data)
            didFetch = true
            setLoading(null)
            if (response) {
                const userData = decodeJWT(response.__cred)
                setUser(userData)
                setTheme(userData.theme)
                setImg(userData.img)
                setRoles(userData.roles?.split(', ') || ['Usuario'])
                setMainRol(userData.roles?.split(', ')[0] || ['Usuario'])
                setAdmin(userData.roles?.split(', ').includes('Administrador'))

                localStorage.setItem('theme',userData.theme)
                
                return { data: userData, logged: 1}
            } else return response
        } catch (err) {
            throw err 
        }
    }
    
    // Cerrar sesion 
    const logout = async ( URL = '') => {
        try {
            const check = await PostCookie(`${URL}/cookies/clear`, {})
            setLoading(null)
            if (check) {
                setUser(null)
                setMainRol(null)
                setRoles(null)
                setAdmin(null)
                setTheme(null)
                window.location.href = '/login'
            }
        } catch (err) {
            setUser(null)
        }
    }
    
    // Verificar sesión al cargar
    useEffect(() => {
        const checkAuth = async () => {
            if (didFetch) return
            setLoading(true)
            try {
                const check = await PostCookie('http://localhost:3000/ecommerce/cookies/check', { name: '__cred' })
                didFetch = true
                setLoading(null)
                if (check) {
                    const userData = decodeJWT(check.data)
                    setUser(userData)
                    setTheme(userData.theme)
                    setImg(userData.img)
                    setRoles(userData?.roles?.split(', ') || ['Usuario'])
                    setMainRol(userData.roles?.split(', ')[0] || 'Usuario')
                    setAdmin(userData.roles?.split(', ').includes('Administrador')? 1: 0)

                    localStorage.setItem('theme',userData.theme)
                }
            } catch (err) {
                setLoading(null)
                setUser(null)
                // if (err.status) logout('http://localhost:3000/ecommerce')
            }
        }
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ admin, theme, img, mainRol, user, roles, login, logout }}>
            {loading ? (
                <AdminLoadingScreen fullScreen message='Cargando datos...' />
                ): children
            }
        </AuthContext.Provider>
    )
}