import { tasksCollection } from './firebaseConfig.js';

/**
 * [READ] Busca todas as tarefas da coleção 'tasks' no Firestore.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de objetos de tarefas.
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

// Funções adiciona dps
export const addTask = async (taskData) => {
    throw new Error("Função ADD não implementada.");
};

export const updateTask = async (id, newData) => {
    throw new Error("Função UPDATE não implementada.");
};

export const deleteTask = async (id) => {
    throw new Error("Função DELETE não implementada.");
};