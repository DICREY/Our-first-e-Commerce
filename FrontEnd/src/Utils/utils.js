// Librarys 
import { useEffect, useState } from "react"

// Greeting
export const Greeting = () => {
  const hora = new Date().getHours()
  if (hora < 12) return "Buenos días"
  if (hora < 18) return "Buenas tardes"
  return "Buenas noches"
}

export const CheckImage = ({ src = '', alt = '', imgDefault = '', className = '' }) => {
  const [imgSrc, setImgSrc] = useState(imgDefault);

  useEffect(() => {
    // Resetear a la imagen por defecto cuando cambia la fuente
    setImgSrc(imgDefault);

    if (!src || src === 'No-Registrado' || src.trim() === '') {
      return;
    }

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImgSrc(src);
    };

    img.onerror = () => {
      console.warn(`Error loading image: ${src}`);
      setImgSrc(imgDefault);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, imgDefault]);

  return (
    <img
      className={className}
      src={imgSrc}
      alt={alt || 'Imagen no disponible'}
      onError={() => {
        console.warn(`Fallback triggered for image: ${src}`);
        setImgSrc(imgDefault);
      }}
    />
  );
};
// Convierte la primera letra en mayúscula y el resto en minúscula
export const capitalize = (word = '') => {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// decodificar token
export const decodeJWT = (token = '') => {
  try {
    // Validación básica
    if (!token || typeof token !== "string") {
      console.error("Token no es un string válido")
      return null
    }

    // Dividir el token
    const parts = token.split(".")

    if (parts.length !== 3) {
      console.error("Formato JWT inválido (debe tener 3 partes)")
      return null
    }

    const base64Url = parts[1]
    if (!base64Url) {
      console.error("Payload vacío en el token")
      return null
    }

    // Decodificar
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")

    const payload = JSON.parse(atob(base64))

    return payload
  } catch (error) {
    console.error("Error decodificando el token:", error)
    return null
  }
}

// Get name of jwt
export const getName = (token = "") => {
  const decodeToken = decodeJWT(token)
  if (!decodeToken) {
    console.warn("No se pudo decodificar el token para obtener nombre")
    return "Usuario"
  }

  const name = decodeToken.names || ""
  const lastName = decodeToken.lastNames || ""

  return `${name}${lastName ? " " + lastName : ""}`
}

// Date traductor
export const formatDate = (dateString = "") => {
  if (dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-CA')
  }
  return false
}

// Diferencia porcentual
export const PriceCompare = (precioOriginal = 0, precioNuevo = 0) => {
  // Validación de entradas
  if (typeof precioOriginal !== 'number' || typeof precioNuevo !== 'number') {
    throw new Error('Ambos parámetros deben ser números');
  }

  // Cálculo de la diferencia
  const diferencia = precioNuevo - precioOriginal;
  let porcentaje = precioOriginal === 0 ? 100 : (diferencia / precioOriginal) * 100
  const porcentajeRedondeado = (porcentaje * 100) / 100;

  // Determinar dirección del cambio
  let direccion;
  if (porcentaje > 0) {
    direccion = '+';
  } else if (porcentaje < 0) {
    direccion = '-';
  } else {
    direccion = '=';
  }

  return {
    diferencia: `${formatNumber(porcentajeRedondeado)}%`,
    direccion: direccion,
    precioOriginal: precioOriginal,
    precioNuevo: precioNuevo,
    diferenciaAbsoluta: diferencia
  };
}

// Function to filter
export const searchFilter = (term = '', data = [], headers = []) => {
  if (!term || !data || !headers || !Array.isArray(data) || !Array.isArray(headers)) return data

  // const termLower = term == ''? term.toLowerCase(): term
  const termLower = term.toLowerCase().trim()

  const find = data?.filter(item => {
    return headers?.some(field =>
      item[field]?.toLowerCase().includes(termLower)
    )
  })

  if (find) return find
}

// Get age of birthday
export const getAge = (fec = "") => {
  const calcAge = (fechaNac) => {
    const hoy = new Date()
    const fechaNacDate = new Date(fechaNac)

    let edad = hoy.getFullYear() - fechaNacDate.getFullYear()
    const mes = hoy.getMonth() - fechaNacDate.getMonth()

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacDate.getDate())) edad--

    return edad
  }

  return calcAge(fec)
}

// Handle request errors
export const errorStatusHandler = (err) => {
  const returnMessage = (errStatus) => {
    let message = 'Error interno'

    if (errStatus?.response?.data?.message) {
      return errStatus.response.data.message
    } else if (errStatus?.message) return errStatus.message

    if (errStatus.status >= 500) return 'Error del servidor por favor intentelo mas tarde'

    switch (errStatus.status) {
      case 302:
        message = 'Ya existe en el sistema'
        break

      case 400:
        message = 'Contenido invalido o falta información'
        break

      case 401:
        message = 'Usuario no autorizado'
        break

      case 403:
        message = 'Sesion expirada'
        break

      case 404:
        message = 'No se encontro lo que buscas'
        break

      case 409:
        message = 'Conflicto, datos duplicados'
        break

      case 423:
        message = 'Bloqueado'
        break

      case 425:
        message = 'Demasiado temprano'
        break

      case 429:
        message = 'Demasiados intentos espera un momento'
        break

      case 498:
        message = 'Usuario no autorizado'
        break

      default:
        message = errStatus
        break
    }

    return message
  }
  return returnMessage(err)
}

// Convertir horario 24h a 12h
export const hourTraductor = (hour) => {
  if (!hour || typeof hour !== "string") return "";

  const [hours, minutes, seconds] = hour.split(':');

  const hourNum = parseInt(hours, 10);
  const minuteNum = minutes ? parseInt(minutes, 10) : 0;

  if (!hourNum < 0 || hourNum > 23 || minuteNum < 0 || minuteNum > 59) {
    return '';
  }

  const period = hourNum >= 12 ? "P.M" : "A.M";

  let twelveHour = hourNum % 12;
  twelveHour = twelveHour === 0 ? 12 : twelveHour;

  const formattedMins = minuteNum.toString().padStart(2, "0");

  return `${twelveHour}:${formattedMins} ${period}`;
}

// Dividir lista en partes 
export const divideList = (array = [], size = 5) => {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

export const formatNumber = (num = 0) => {
  if (isNaN(num)) return '0.00'
  return num
    .toFixed(2) // dos decimales
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".") // puntos cada 3 cifras
}

// Función auxiliar para calcular descuentos
export const calculateDiscount = (currentPrice, originalPrice) => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

export const LegalAge = () => {
  const currentDate = new Date()

  currentDate.setFullYear(currentDate.getFullYear() - 18)

  return currentDate.toLocaleDateString('en-CA')
}