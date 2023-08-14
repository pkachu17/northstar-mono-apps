import { addDoc, collection, getDoc, doc, query, where, getDocs } from 'firebase/firestore'
import { firestoreDB } from '../../../../firebaseConfig'

export const fetchDocument = async ({ collectionName, id }) => {
    console.log("Fetching document for collection", collectionName, "with ID", id)
    const docRef = doc(firestoreDB, collectionName, id)
    console.log("doc ref", docRef)
    const querySnapshot = await getDoc(docRef).catch(err => {
        console.log("Errored fetching document", err)
    })
    console.log("snapshot", querySnapshot)
    console.log("snapshot data", querySnapshot.data())
    return querySnapshot.data()
}

export const postDocument = async ({ collectionName, data }) => {
    const collectionRef = collection(firestoreDB, collectionName)
    const addRes = await addDoc(collectionRef, data)
    return addRes
}

export const fetchSpecificDocuments = async ({ collectionName, key, value }) => {
    const collectionRef = collection(firestoreDB, collectionName)
    const specQuery = query(collectionRef, where(key, "==", value))
    const querySnapshot = await getDocs(specQuery)
    const arrData = []
    querySnapshot.forEach(item => arrData.push(item.data()))
    return arrData
}