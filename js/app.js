// js/app.js
import { getTasks, addTask, updateTask, deleteTask } from './crudService.js';

const tasksListEl = document.getElementById('tasks-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const loadingMessage = document.getElementById('loading-message');


/**
 * Cria o HTML de um item de tarefa.
 * @param {Object} task - Objeto da tarefa (id, description, isDone).
 * @returns {string} HTML do item da lista.
 */
const createTaskHtml = (task) => {
    const isDoneClass = task.isDone ? 'task-done' : '';
    const buttonText = task.isDone ? 'Desfazer' : 'Concluir';
    const buttonColor = task.isDone ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600';

    return `
        <div class="flex items-center justify-between p-4 mb-4 bg-gray-50 border border-gray-200 rounded-lg ${isDoneClass}" data-task-id="${task.id}">
            <span class="text-lg text-gray-700">${task.description}</span>
            <div class="flex gap-2">
                <button class="update-btn ${buttonColor} text-white text-xs font-bold py-2 px-3 rounded" 
                        data-action="toggle" 
                        data-id="${task.id}" 
                        data-is-done="${task.isDone}">
                    ${buttonText}
                </button>
                <button class="delete-btn bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 px-3 rounded" 
                        data-id="${task.id}">
                    Excluir
                </button>
            </div>
        </div>
    `;
};


/**
 * Renderiza todas as tarefas na interface. (Chama o READ do back-end)
 */
const renderTasks = async () => {
    try {
        tasksListEl.innerHTML = ''; // Limpa a lista
        loadingMessage.textContent = 'Carregando tarefas...';
        
        const tasks = await getTasks(); // CHAMADA AO BACK-END (crudService.js)
        
        if (tasks.length === 0) {
            tasksListEl.innerHTML = '<p class="text-gray-500 italic text-center">Nenhuma tarefa encontrada. Adicione uma!</p>';
        } else {
            const tasksHtml = tasks.map(createTaskHtml).join('');
            tasksListEl.innerHTML = tasksHtml;
        }

    } catch (error) {
        tasksListEl.innerHTML = '<p class="text-red-500 italic text-center">Erro ao carregar as tarefas. Verifique o console.</p>';
        console.error("Erro na renderização:", error.message);
    }
};


// --------------------------------------------------------
// INICIALIZAÇÃO
// --------------------------------------------------------

// Renderiza a lista de tarefas ao carregar a página (Primeiro uso do READ)
document.addEventListener('DOMContentLoaded', renderTasks);