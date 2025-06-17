// Librarys 
import axios from 'axios'

// Functions 
// Traer datos
export async function GetData(URL = '') {
    try {
        const response = await axios.get(URL,{ 
            headers: {
                    'x-api-key': 'e_commerce'
            },
            withCredentials: true })

        if (response.statusText !== 'OK') throw response

        return response.data.result[0]
    } catch (error) {
        throw error
    }
}
// Enviar datos 
export async function PostData(URL = '', datas = {}) {
    try {
        const response = await axios.post( URL, {...datas}, { 
            headers: {
                'x-api-key': 'e_commerce'
            },
            withCredentials: true} )
  
        // Manejar diferentes códigos de estado
        if(200 >= response.status <= 299) {
            return response.data
        } else throw response

  
    } catch (error) {
        throw error
    }
}
// Modificar datos
export async function ModifyData(URL = '', datas = {}) {
    try {
        const response = await axios.put( URL, {...datas}, { 
            headers: {
                'x-api-key': 'e_commerce'
            },
            withCredentials: true } )

        if (response.statusText !== 'OK') throw response

        return response.data

    } catch (error) {
        throw error
    }
}
// Delete data
export async function DeleteData(URL = '', datas = {}) {
    try {
        const response = await axios.delete( URL, {...datas}, { 
            headers: {
                'x-api-key': 'e_commerce'
            },
            withCredentials: true } )

        if (response.statusText !== 'OK') {
            throw response
        }

        return response

    } catch (error) {
        throw error
    }
}