// Librarys 
import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

// Imports 
import { decodeJWT, errorStatusHandler, showAlert } from '../Utils/utils'
import { PostCookie, PostData } from '../Utils/Requests'
import { AuthContext } from './Contexts'
import AdminLoadingScreen from '../components/Global/Loading'

// Contexts 
export const AuthProvider = ({ children }) => {
    // Dynamic vars
    const [user, setUser] = useState(null)
    const [roles, setRoles] = useState(null)
    const [theme, setTheme] = useState('DARK')
    const [admin, setAdmin] = useState(false)
    const [img, setImg] = useState(null)
    const [loading, setLoading] = useState(true)
    const [favorites, setFavorites] = useState([])
    const [token, setToken] = useState(null)

    // Vars 
    let didFetch = false
    const URL = process.env.REACT_APP_URL

    // Función para cargar favoritos
    const loadFavorites = async (email) => {
        try {
            if (!user) return []
            // 1. Primero verificar si hay datos en localStorage
            const cachedFavorites = localStorage.getItem(`favorites_${email}`)
            if (cachedFavorites) setFavorites(JSON.parse(cachedFavorites))

            // 2. Siempre hacer fetch para mantener sincronizados
            const freshFavorites = await PostData(`${URL}/products/favorites/by`,{ email: email })
            if (freshFavorites) {
                setFavorites(freshFavorites)
                localStorage.setItem(`favorites_${email}`, JSON.stringify(freshFavorites))
            }
        } catch (error) {
            const message = errorStatusHandler(error)
            console.log(message)
        }
    }

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
                setToken(response.__cred) // Guardar el token
                setTheme(userData.theme)
                setImg(userData.img)
                setRoles(userData.roles?.split(', ') || ['Usuario'])    
                setAdmin(userData.roles?.split(', ').includes('Administrador'))

                localStorage.setItem('theme', userData.theme)

                await loadFavorites(userData.email) // Cargar favoritos al iniciar sesión
                return { data: userData, logged: 1 }
            } else return response
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }
    
    // Cerrar sesion 
    const logout = async (URL = '') => {
        try {
            const check = await PostCookie(`${URL}/cookies/clear`, {})
            setLoading(null)
            if (check) {
                setUser(null)
                setToken(null)
                setRoles(null)
                setAdmin(null)
                setTheme(null)
                setFavorites([])
                return <Navigate to="/login" />
            }
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }

    // Change Theme
    const changeTheme = async () => {
        try {
            const got = await PostData(`${URL}/credential/preffers/change-theme`, {
                doc: user.doc,
                theme: theme
            })
            if (got.success && got.result) {
                localStorage.setItem('theme', got?.result?.[0]?.theme)
                setTheme(got?.result?.[0]?.theme || 'DARK')
            }
        } catch (err) {
            const message = errorStatusHandler(err)
            showAlert('Error', message, 'error')
        }
    }
    
    // Verificar sesión al cargar
    useEffect(() => {
        const checkAuth = async () => {
            if (didFetch) return
            setLoading(true)
            try {
                const check = await PostCookie(`${URL}/cookies/check`, { name: '__cred' })
                didFetch = true
                setLoading(null)
                if (check) {
                    const userData = decodeJWT(check.data)
                    setUser(userData)
                    setToken(check.data) // Guardar el token
                    setTheme(userData.theme)
                    setImg(userData.img)
                    setRoles(userData?.roles?.split(', ') || ['Usuario'])
                    setAdmin(userData.roles?.split(', ').includes('Administrador')? 1: 0)
                    
                    // Cargar favoritos al verificar autenticación                    
                    await loadFavorites(userData.email)
                }
            } catch (err) {
                setLoading(null)
                const message = errorStatusHandler(err)
                console.log(message)
            }
        }
        checkAuth()
    }, [])

       // Función para alternar favoritos
    const toggleFavorite = async (productId) => {
        if (!user) return false
        try {
            const isCurrentlyFavorite = favorites.some(fav => fav.id_pro === productId)
            
            if (isCurrentlyFavorite) {
                // Eliminar de favoritos
                await PostData(`${URL}/products/favorites/remove`, {
                    email: user.email,
                    productId
                })       
                showAlert("Éxito", "Producto eliminado de favoritos", "success")
            } else {
                // Agregar a favoritos
                await PostData(`${URL}/products/favorites/add`, {
                    email: user.email,
                    productId
                })
                
                showAlert("Éxito", "Producto agregado a favoritos", "success")
            }

            // Actualizar estado y localStorage
            await loadFavorites(user.email)
            return true
        } catch (error) {
            const message = errorStatusHandler(error)
            console.log(message)
        }
    }

    return (
        <AuthContext.Provider value={{ 
            admin, 
            theme, 
            img, 
            user, 
            roles, 
            token,
            favorites,
            login, 
            logout, 
            changeTheme,
            toggleFavorite,
            isFavorite: (productId) => favorites?.some(fav => fav?.id_pro === productId)
        }}>
            {loading ? (
                <AdminLoadingScreen fullScreen message='Cargando datos...' />
                ) : children
            }
        </AuthContext.Provider>
    )
}