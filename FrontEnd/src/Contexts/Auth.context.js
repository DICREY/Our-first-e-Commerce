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
    const [ admin, setAdmin ] = useState(false)

    // Functions
    // Iniciar sesion 
    const login = async (url = '', data = {}) => {
        try {            
            const response = await PostData(url, data)
            if (response) {
                const userData = decodeJWT(response.__cred)
                setUser(userData)
                setRoles(userData.roles?.split(', ') || ['Usuario'])
                setMainRol(userData.roles?.split(', ')[0] || ['Usuario'])
                setAdmin(userData.roles?.split(', ').includes('Administrador'))
                return { data: userData, logged: 1}
            } else return response
        } catch (err) {
            throw err 
        }
    }

    // Cerrar sesion 
    const logout = async () => {
        try {
            const check = await PostData('http://localhost:3000/ecommerce/cookies/clear', {})
            if (check) {
                setUser(null)
                setMainRol(null)
                setRoles(null)
                setAdmin(null)
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
                const check = await PostData('http://localhost:3000/ecommerce/cookies/check', { name: '__cred' })
                if (check) {
                    const userData = decodeJWT(check.data)
                    setUser(userData)
                    setRoles(userData?.roles?.split(', ') || ['Usuario'])
                    setMainRol(userData.roles?.split(', ')[0] || 'Usuario')
                    setAdmin(userData.roles?.split(', ').includes('Veterinario'))
                }
            } catch (err) {
                setUser(null)
            }
        }
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ admin, mainRol, user, roles, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}