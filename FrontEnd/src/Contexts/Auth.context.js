import React, { useState, useEffect } from 'react'
import { decodeJWT, errorStatusHandler, showAlert } from '../Utils/utils'
import { PostCookie, PostData, GetData } from '../Utils/Requests'
import { AuthContext } from './Contexts'
import AdminLoadingScreen from '../components/Global/Loading'

export const AuthProvider = ({ children }) => {
    // Dynamic vars
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState(null);
    const [mainRol, setMainRol] = useState(null);
    const [theme, setTheme] = useState('DARK');
    const [admin, setAdmin] = useState(false);
    const [img, setImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [token, setToken] = useState(null);

    // Vars 
    let didFetch = false;
    const URL = 'http://localhost:3000/ecommerce'

    // Función para cargar favoritos
    const loadFavorites = async (userDoc) => {
        try {
            // 1. Primero verificar si hay datos en localStorage
            const cachedFavorites = localStorage.getItem(`favorites_${userDoc}`);
            
            if (cachedFavorites) {
                setFavorites(JSON.parse(cachedFavorites));
            }

            // 2. Siempre hacer fetch para mantener sincronizados
            const freshFavorites = await GetData(`${URL}/products/favorites/${userDoc}`);
            setFavorites(freshFavorites);
            localStorage.setItem(`favorites_${userDoc}`, JSON.stringify(freshFavorites));
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    };


    // Iniciar sesion 
    const login = async (url = '', data = {}) => {
        if (didFetch) return;
        try {            
            const response = await PostCookie(url, data);
            didFetch = true;
            setLoading(null);
            if (response) {
                const userData = decodeJWT(response.__cred);
                setUser(userData);
                await loadFavorites(userData.doc);
                setToken(response.__cred); // Guardar el token
                setTheme(userData.theme);
                setImg(userData.img);
                setRoles(userData.roles?.split(', ') || ['Usuario']);
                setMainRol(userData.roles?.split(', ')[0] || ['Usuario']);
                setAdmin(userData.roles?.split(', ').includes('Administrador'));

                localStorage.setItem('theme', userData.theme);
                await loadFavorites(userData.doc_per); // Cargar favoritos al iniciar sesión

                return { data: userData, logged: 1 };
            } else return response;
        } catch (err) {
            const message = errorStatusHandler(err);
            showAlert('Error', message, 'error');
        }
    };
    
    // Cerrar sesion 
    const logout = async (URL = '') => {
        try {
            const check = await PostCookie(`${URL}/cookies/clear`, {});
            setLoading(null);
            if (check) {
                setUser(null);
                setToken(null);
                setMainRol(null);
                setRoles(null);
                setAdmin(null);
                setTheme(null);
                setFavorites([]);
                window.location.href = '/login';
            }
        } catch (err) {
            const message = errorStatusHandler(err);
            showAlert('Error', message, 'error');
        }
    };

    // Change Theme
    const changeTheme = async () => {
        try {
            const got = await PostData(`${URL}/credential/preffers/change-theme`, {
                doc: user.doc,
                theme: theme
            });
            if (got.success && got.result) {
                localStorage.setItem('theme', got?.result?.[0]?.theme);
                setTheme(got?.result?.[0]?.theme || 'DARK');
            }
        } catch (err) {
            const message = errorStatusHandler(err);
            showAlert('Error', message, 'error');
        }
    };
    
    // Verificar sesión al cargar
    useEffect(() => {
        const checkAuth = async () => {
            if (didFetch) return;
            setLoading(true);
            try {
                const check = await PostCookie(`${URL}/cookies/check`, { name: '__cred' });
                didFetch = true;
                setLoading(null);
                if (check) {
                    const userData = decodeJWT(check.data);
                    setUser(userData);
                    setToken(check.data); // Guardar el token
                    setTheme(userData.theme);
                    setImg(userData.img);
                    setRoles(userData?.roles?.split(', ') || ['Usuario']);
                    setMainRol(userData.roles?.split(', ')[0] || 'Usuario');
                    setAdmin(userData.roles?.split(', ').includes('Administrador')? 1: 0);
                    
                    // Cargar favoritos al verificar autenticación
                    await loadFavorites(userData.doc_per);
                }
            } catch (err) {
                setLoading(null);
                const message = errorStatusHandler(err);
            }
        };
        checkAuth();
    }, []);

       // Función para alternar favoritos
    const toggleFavorite = async (productId) => {
        if (!user) {
            // Manejar redirección a login
            return false;
        }

        try {
            let updatedFavorites;
            const isCurrentlyFavorite = favorites.some(fav => fav.id_pro === productId);
            
            if (isCurrentlyFavorite) {
                // Eliminar de favoritos
                await DeleteData(`${URL}/products/favorites/remove`, {
                    doc_per: user.doc,
                    productId
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                updatedFavorites = favorites.filter(fav => fav.id_pro !== productId);
            } else {
                // Agregar a favoritos
                const response = await PostData(`${URL}/products/favorites/add`, {
                    doc_per: user.doc,
                    productId
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                updatedFavorites = [...favorites, response.product];
            }

            // Actualizar estado y localStorage
            setFavorites(updatedFavorites);
            localStorage.setItem(`favorites_${user.doc}`, JSON.stringify(updatedFavorites));
            
            return true;
        } catch (error) {
            console.error("Error toggling favorite:", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            admin, 
            theme, 
            img, 
            mainRol, 
            user, 
            roles, 
            token,
            favorites,
            login, 
            logout, 
            changeTheme,
            toggleFavorite,
            isFavorite: (productId) => favorites.some(fav => fav.id_pro === productId)
        }}>
            {loading ? (
                <AdminLoadingScreen fullScreen message='Cargando datos...' />
                ) : children
            }
        </AuthContext.Provider>
    );
};