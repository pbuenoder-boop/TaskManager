const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); 

//Inicializando o Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // Certifique-se que o URL do banco de dados está correto
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com` 
    });
}

module.exports.db = admin.firestore();

module.exports.cleanup = async (collectionName) => {
    const db = module.exports.db;
    const batch = db.batch();
    const snapshot = await db.collection(collectionName).get();

    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
};