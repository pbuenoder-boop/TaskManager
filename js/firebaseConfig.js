// js/firebaseConfig.js

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD_Yn4JEuNoKTz0cAxkhtfxavfesINl1Ak",
    authDomain: "gerenciador-de-tarefas-d9521.firebaseapp.com",
    projectId: "gerenciador-de-tarefas-d9521",
    storageBucket: "gerenciador-de-tarefas-d9521.firebasestorage.app",
    messagingSenderId: "474909008453",
    appId: "1:474909008453:web:7dcab1ec931d00f22cb92c"
};

// Inicializa APENAS se estiver no navegador (onde 'firebase' existe)
let app = null;
let dbInstance = null;
let collectionRef = null;

if (typeof firebase !== 'undefined') {
    app = firebase.initializeApp(firebaseConfig);
    dbInstance = firebase.firestore();
    collectionRef = dbInstance.collection('tasks');
}

export const firebaseApp = (typeof firebase !== 'undefined') ? firebase : null;
export const db = dbInstance;
export const tasksCollection = collectionRef;