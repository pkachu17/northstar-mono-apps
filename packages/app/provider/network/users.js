import { fetchSpecificDocuments, postDocument } from './firebaseManager'

export const addUser = async ({ userName, userEmail, firebaseUID, authProvider }) => {
    const userData = {
        name: userName,
        email: userEmail,
        uid: firebaseUID,
        authProvider
    }
    const addReq = await postDocument({
        collectionName: "users",
        userData
    })
}

export const getUserDetails = async ({ firebaseUserID }) => {
    const fetchReq = await fetchSpecificDocuments({
        collectionName: "users",
        key: "uid",
        value: firebaseUserID
    })
    return fetchReq[0]
}