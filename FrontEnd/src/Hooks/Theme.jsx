// Librarys 
import { useContext, useEffect, useState } from 'react'

// Imports 
import { AuthContext } from '../Contexts/Contexts'

// Hooks 
export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'DARK' || 
           (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    // Aplicar el modo oscuro al montar el componente
    toggleDarkMode(isDarkMode)
  }, [])

  const toggleDarkMode = (enabled) => {
    const root = document.documentElement
    
    if (enabled) {
      // Variables para modo oscuro
      root.style.setProperty('--white', '#2c3441ff')
      root.style.setProperty('--primary-50', '#1a1a2e')
      root.style.setProperty('--primary-100', '#16213e')
      root.style.setProperty('--primary-500', '#4f46e5')
      root.style.setProperty('--primary-600', '#6366f1')
      root.style.setProperty('--primary-700', '#818cf8')
      
      root.style.setProperty('--primary-color', '#6b7280')
      root.style.setProperty('--secondary-color', '#818cf8')
      root.style.setProperty('--secondary', '#818cf8')
      
      root.style.setProperty('--light-gray', '#1f2937')
      root.style.setProperty('--medium-gray', '#374151')
      root.style.setProperty('--dark-gray', '#9ca3af')
      
      root.style.setProperty('--neutral-50', '#111827')
      root.style.setProperty('--neutral-100', '#1f2937')
      root.style.setProperty('--neutral-200', '#374151')
      root.style.setProperty('--neutral-300', '#4b5563')
      root.style.setProperty('--neutral-800', '#e5e7eb')
      
      root.style.setProperty('--gray-50', '#121212')
      root.style.setProperty('--gray-100', '#1e1e1e')
      root.style.setProperty('--gray-200', '#2a2a2a')
      root.style.setProperty('--gray-300', '#363636')
      root.style.setProperty('--gray-400', '#424242')
      root.style.setProperty('--gray-500', '#9e9e9e')
      root.style.setProperty('--gray-600', '#bdbdbd')
      root.style.setProperty('--gray-700', '#e0e0e0')
      root.style.setProperty('--gray-800', '#eeeeee')
      root.style.setProperty('--gray-900', '#ffffff')
      root.style.setProperty('--gray-t-900', '#ffffff81')
      
      root.style.setProperty('--text-primary', '#f3f4f6')
      root.style.setProperty('--text-secondary', '#d1d5db')
      
      root.style.setProperty('--shadow', '0 1px 3px rgba(255, 255, 255, 0.1)')
      root.style.setProperty('--shadow-sm', '0 .1rem .15rem 0 rgba(255, 255, 255, 0.151)')
      root.style.setProperty('--shadow-md', '0 .2rem 6px -.1rem rgba(255, 255, 255, 0.1), 0 2px 4px -2px rgba(255, 255, 255, 0.1)')
      root.style.setProperty('--shadow-lg', '0 .6rem .95rem -.2rem rgba(255, 255, 255, 0.1), 0 4px 6px -4px rgba(255, 255, 255, 0.1)')
      root.style.setProperty('--shadow-xl', '0 1.3rem 1.8rem -.35rem rgba(255, 255, 255, 0.1), 0 8px 10px -6px rgba(255, 255, 255, 0.1)')
      
      // Añadir clase dark al body para estilos específicos
      document.body.classList.add('dark')
    } else {
      // Restaurar valores originales (modo claro)
      root.style.setProperty('--white', '#ffffff')
      root.style.setProperty('--primary-50', '#f0f7ff')
      root.style.setProperty('--primary-100', '#e0f2fe')
      root.style.setProperty('--primary-500', '#3b82f6')
      root.style.setProperty('--primary-600', '#2563eb')
      root.style.setProperty('--primary-700', '#1d4ed8')
      
      root.style.setProperty('--primary-color', '#A7C7E7')
      root.style.setProperty('--secondary-color', '#3814d8')
      root.style.setProperty('--secondary', '#3814d8')
      
      root.style.setProperty('--light-gray', '#f3f4f6')
      root.style.setProperty('--medium-gray', '#e5e7eb')
      root.style.setProperty('--dark-gray', '#6b7280')
      
      root.style.setProperty('--neutral-50', '#f8fafc')
      root.style.setProperty('--neutral-100', '#f1f5f9')
      root.style.setProperty('--neutral-200', '#e2e8f0')
      root.style.setProperty('--neutral-300', '#d4d4d4')
      root.style.setProperty('--neutral-800', '#1e293b')
      
      root.style.setProperty('--gray-50', '#FAFAFA')
      root.style.setProperty('--gray-100', '#F5F5F5')
      root.style.setProperty('--gray-200', '#EEEEEE')
      root.style.setProperty('--gray-300', '#E0E0E0')
      root.style.setProperty('--gray-400', '#BDBDBD')
      root.style.setProperty('--gray-500', '#9E9E9E')
      root.style.setProperty('--gray-600', '#757575')
      root.style.setProperty('--gray-700', '#616161')
      root.style.setProperty('--gray-800', '#424242')
      root.style.setProperty('--gray-900', '#212121')
      root.style.setProperty('--gray-t-900', '#21212181')
      
      root.style.setProperty('--text-primary', '#1e293b')
      root.style.setProperty('--text-secondary', '#64748b')
      
      root.style.setProperty('--shadow', '0 1px 3px rgba(0, 0, 0, 0.1)')
      root.style.setProperty('--shadow-sm', '0 .1rem .15rem 0 rgba(0, 0, 0, 0.151)')
      root.style.setProperty('--shadow-md', '0 .2rem 6px -.1rem rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)')
      root.style.setProperty('--shadow-lg', '0 .6rem .95rem -.2rem rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)')
      root.style.setProperty('--shadow-xl', '0 1.3rem 1.8rem -.35rem rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)')
      
      // Remover clase dark del body
      document.body.classList.remove('dark')
    }
    
    setIsDarkMode(enabled)
    localStorage.setItem('darkMode', enabled)
  }

  return [isDarkMode, toggleDarkMode]
}