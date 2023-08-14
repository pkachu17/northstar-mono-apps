// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyANDGmnztamWsPzVR8cEchGYfE0dMhyICw",
    authDomain: "northstar-aa415.firebaseapp.com",
    projectId: "northstar-aa415",
    storageBucket: "northstar-aa415.appspot.com",
    messagingSenderId: "1036002322953",
    appId: "1:1036002322953:web:d536fe53bf24ffc3e7e6d8",
    measurementId: "G-HPX46DT3G3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(
    app, {
    persistence: getReactNativePersistence(AsyncStorage)
}
)

export const firestoreDB = getFirestore(app);
