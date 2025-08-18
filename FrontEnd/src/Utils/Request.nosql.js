// Librarys 
import { collection, getDocs, addDoc } from 'firebase/firestore'

// Imports 
import { db } from "../Hooks/AuthFirebase"

// Functions request 
export const GetDataNoSQL = async ( doc = '' ) => {
    try {
        const querySnapshot = await getDocs(collection(db, `${doc}`))
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        console.log(data)
        return data
    } catch (error) {
        console.error(`Error fetching ${doc}: `, error)
    }
}
export const PostDataNoSQL = async ( doc = '', data = {} ) => {
    try {
    const docRef = await addDoc(collection(db, doc), data);
    console.log("Document written with ID: ", docRef.id);
    return {
        message: 'created',
        success: 1
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}