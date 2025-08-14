// hooks/useFavorites.js
import { useContext } from 'react';
import { AuthContext } from '../Contexts/Contexts';
import { PostData, DeleteData } from '../Utils/Requests';

const useFavorites = () => {
  const { user, token, favorites, setFavorites } = useContext(AuthContext);

  const isFavorite = (productId) => {
    return favorites.some(fav => fav.id_pro === productId);
  };

  const toggleFavorite = async (productId) => {
    if (!user) {
      // Manejar redirección a login
      return false;
    }

    try {
      let updatedFavorites;
      
      if (isFavorite(productId)) {
        // Eliminar de favoritos
        await DeleteData(`${URL}/products/favorites/remove`, {
          doc_per: user.doc_per,
          productId
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        updatedFavorites = favorites.filter(fav => fav.id_pro !== productId);
      } else {
        // Agregar a favoritos
        const response = await PostData(`${URL}/products/favorites/add`, {
          doc_per: user.doc_per,
          productId
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        updatedFavorites = [...favorites, response.product];
      }

      // Actualizar estado y localStorage
      setFavorites(updatedFavorites);
      localStorage.setItem(`favorites_${user.doc_per}`, JSON.stringify(updatedFavorites));
      
      return true;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return false;
    }
  };

  return { favorites, isFavorite, toggleFavorite };
};

export default useFavorites;