// Librarys 
import React, { useState, useEffect } from 'react'

// Imports 
import { decodeJWT } from '../Utils/utils'
import { PostData } from '../Utils/Requests'
import { AuthContext } from './Contexts'

// Component
export const AuthProvider = ({ children }) => {
    // Dynamic vars
    const [ user, setUser ] = useState(null)
    const [ roles, setRoles ] = useState(null)
    const [ mainRol, setMainRol ] = useState(null)

    // Functions
    // Iniciar sesion 
    const login = async (url = '', data = {}) => {
        try {            
            const response = await PostData(url, data)
            if (response) {
                const userData = decodeJWT(response.__cred)
                setUser(userData)
                return { data: userData, logged: 1}
            }
            return response
        } catch (err) {
            throw err 
        }
    }

    // Cerrar sesion 
    const logout = async () => {
        try {
            const check = await PostData('http://localhost:3000/cookie/clear-cookies', {})
            if (check) {
                setUser(null)
                setRoles(null)
                window.location.href = '/login'
            }
        } catch (err) {
            setUser(null)
        }
    }

    // Verificar sesión al cargar
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const check = await PostData('http://localhost:3000/cookie/check-cookie', { name: '__cred' })
                if (check) {
                    const userData = decodeJWT(check.data)
                    setUser(userData)
                    setRoles(userData?.roles?.split(', ') || ['Usuario'])
                }
            } catch (err) {
                setUser(null)
            }
        }
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ user, roles, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}