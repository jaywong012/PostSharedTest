import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD8UkIl0k84pcv3EUhDsD8ZQ2257fTVue4",
    authDomain: "twttt-dc5b0.firebaseapp.com",
    projectId: "twttt-dc5b0",
    storageBucket: "twttt-dc5b0.firebasestorage.app",
    messagingSenderId: "664012037864",
    appId: "1:664012037864:web:966342c9d5e20ab01e735d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
