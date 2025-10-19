//API do firebase
const firebaseConfig = {
    apiKey: "AIzaSyD_Yn4JEuNoKTz0cAxkhtfxavfesINl1Ak",
    authDomain: "gerenciador-de-tarefas-d9521.firebaseapp.com",
    projectId: "gerenciador-de-tarefas-d9521",
    storageBucket: "gerenciador-de-tarefas-d9521.firebasestorage.app",
    messagingSenderId: "474909008453",
    appId: "1:474909008453:web:7dcab1ec931d00f22cb92c"
};


firebase.initializeApp(firebaseConfig);


export const db = firebase.firestore();
export const tasksCollection = db.collection('tasks');