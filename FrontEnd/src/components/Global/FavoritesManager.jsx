// components/FavoritesManager.js
import { useEffect, useContext } from 'react';
import { AuthContext } from '../Contexts/Contexts';
import { GetData } from '../Utils/Requests';

const FavoritesManager = () => {
  const { user, setFavorites } = useContext(AuthContext);

  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          // 1. Primero verificar si hay datos en localStorage
          const cachedFavorites = localStorage.getItem(`favorites_${user.doc_per}`);
          
          if (cachedFavorites) {
            setFavorites(JSON.parse(cachedFavorites));
          }

          // 2. Siempre hacer fetch para mantener sincronizados
          const freshFavorites = await GetData(`${URL}/products/favorites/${user.doc_per}`);
          setFavorites(freshFavorites);
          localStorage.setItem(`favorites_${user.doc_per}`, JSON.stringify(freshFavorites));
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      } else {
        // Usuario no logueado - limpiar favoritos
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [user, setFavorites]);

  return null; // Este componente no renderiza nada
};

export default FavoritesManager;