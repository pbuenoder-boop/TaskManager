import { tasksCollection, firebaseApp } from './firebaseConfig.js';

/**
 * [READ] Busca todas as tarefas da coleção 'tasks' no Firestore.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de objetos de tarefas.
 */
export const getTasks = async () => {
    try {
        // Ordena pela data de criação (mais recente primeiro)
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
 * @param {string} description - A descrição da nova tarefa.
 * @returns {Promise<string>} Uma promessa que resolve para o ID do novo documento.
 */
export const addTask = async (description) => {
    try {
        const newTask = {
            description: description,
            isDone: false, // Tarefa sempre começa como não concluída
            createdAt: firebaseApp.firestore.FieldValue.serverTimestamp() // Timestamp do servidor
        };
        
        const docRef = await tasksCollection.add(newTask);
        
        return docRef.id;
    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
        throw new Error("Não foi possível adicionar a tarefa.");
    }
};

/**
 * [UPDATE] Atualiza um documento de tarefa no Firestore.
 * @param {string} id - O ID do documento a ser atualizado.
 * @param {Object} newData - Objeto contendo os campos a serem atualizados (ex: {isDone: true}).
 * @returns {Promise<void>}
 */
export const updateTask = async (id, newData) => {
    try {
        // Usa o ID para fazer referência ao documento e atualiza com os novos dados
        await tasksCollection.doc(id).update(newData);
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        throw new Error("Não foi possível atualizar a tarefa.");
    }
};

/**
 * [DELETE] Função a ser implementada no próximo passo!
 */
export const deleteTask = async (id) => {
    throw new Error("Função DELETE não implementada.");
};