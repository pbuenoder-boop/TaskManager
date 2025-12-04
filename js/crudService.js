import { tasksCollection, firebaseApp } from './firebaseConfig.js';

/**
 * [READ] Busca todas as tarefas da coleção 'tasks' no Firestore.
 */
export const getTasks = async () => {
    try {
        const snapshot = await tasksCollection.orderBy('createdAt', 'desc').get();
        
        const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        return tasks;
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        throw new Error("Não foi possível carregar as tarefas do servidor.");
    }
};

/**
 * [CREATE] Adiciona uma nova tarefa ao Firestore.
 */
export const addTask = async (description) => {
    try {
        if (!description) {
            throw new Error("A descrição da tarefa não pode estar vazia.");
        }
        
        const newTask = {
            description: description,
            isDone: false,
            // Acessa FieldValue através do objeto firebaseApp
            createdAt: firebaseApp.firestore.FieldValue.serverTimestamp() 
        };
        
        const docRef = await tasksCollection.add(newTask);
        
        return docRef.id;
    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
        throw new Error(error.message || "Não foi possível adicionar a tarefa.");
    }
};

/**
 * [UPDATE] Atualiza um documento de tarefa no Firestore.
 */
export const updateTask = async (id, newData) => {
    try {
        await tasksCollection.doc(id).update(newData);
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        throw new Error("Não foi possível atualizar a tarefa.");
    }
};

/**
 * [DELETE] Remove um documento de tarefa do Firestore.
 */
export const deleteTask = async (id) => {
    try {
        await tasksCollection.doc(id).delete();
    } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        throw new Error("Não foi possível excluir a tarefa.");
    }
};