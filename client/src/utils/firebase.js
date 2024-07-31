// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB43x_aBNTsvQqhR0s7kCjUivrFMoct-xU",
  authDomain: "e-commerce-35999.firebaseapp.com",
  projectId: "e-commerce-35999",
  storageBucket: "e-commerce-35999.appspot.com",
  messagingSenderId: "664404245381",
  appId: "1:664404245381:web:d0302e1f6233fc0e6562ec",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
