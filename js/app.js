// js/app.js
import { getTasks, addTask, updateTask, deleteTask } from './crudService.js';

const tasksListEl = document.getElementById('tasks-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
// Nota: O elemento 'loading-message' deve ser removido após a renderização
// Ou ser tratado dentro do renderTasks. Vamos reusar tasksListEl para simplicidade.


/**
 * Cria o HTML de um item de tarefa.
 * @param {Object} task - Objeto da tarefa (id, description, isDone).
 * @returns {string} HTML do item da lista.
 */
const createTaskHtml = (task) => {
    const isDoneClass = task.isDone ? 'task-done bg-gray-200' : 'bg-white hover:bg-gray-50'; // Adiciona classe para riscar o texto e cor de fundo
    const buttonText = task.isDone ? 'Desfazer' : 'Concluir';
    const buttonColor = task.isDone ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600';

    return `
        <div class="flex items-center justify-between p-4 mb-4 border border-gray-200 rounded-lg transition duration-150 ease-in-out ${isDoneClass}" data-task-id="${task.id}">
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
        tasksListEl.innerHTML = '<p class="text-gray-500 italic text-center">Carregando tarefas...</p>';
        
        const tasks = await getTasks(); // CHAMADA AO BACK-END (READ)
        updateStats(tasks);
        
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

/**
 * Manipula o envio do formulário para adicionar uma nova tarefa. (CREATE)
 * @param {Event} e - O evento de envio do formulário.
 */
const handleAddTask = async (e) => {
    e.preventDefault();

    const description = taskInput.value.trim();

    if (description) {
        try {
            // CHAMADA AO BACK-END (CREATE)
            await addTask(description); 
            
            taskInput.value = '';
            await renderTasks(); // Recarrega a lista para mostrar a nova tarefa

        } catch (error) {
            alert(error.message);
        }
    }
};

/**
 * Manipula o clique no botão 'Excluir' (DELETE).
 * @param {string} id - O ID da tarefa a ser excluída.
 */
const handleDeleteTask = async (id) => {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
        try {
            // 1. CHAMADA AO BACK-END (DELETE)
            await deleteTask(id); 
            
            // 2. Recarrega a lista
            await renderTasks();

        } catch (error) {
            alert(error.message);
        }
    }
};

/**
 * Manipula o clique nos botões 'Concluir' / 'Desfazer' (Toggle isDone) (UPDATE)
 * @param {string} id - O ID da tarefa.
 * @param {boolean} currentStatus - O status atual da tarefa.
 */
const handleToggleDone = async (id, currentStatus) => {
    try {
        const newStatus = !currentStatus;
        
        // CHAMADA AO BACK-END (UPDATE)
        await updateTask(id, { isDone: newStatus }); 
        
        await renderTasks(); // Recarrega a lista

    } catch (error) {
        alert(error.message);
    }
};


/**
 * Adiciona listeners ao elemento pai para capturar cliques nos botões de AÇÃO (UPDATE e DELETE).
 */
const addGlobalListeners = () => {
    tasksListEl.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.classList.contains('update-btn')) {
            const taskId = target.dataset.id;
            // Converte a string 'true'/'false' do dataset para boolean
            const currentStatus = target.dataset.isDone === 'true'; 
            handleToggleDone(taskId, currentStatus);
        }

        if (target.classList.contains('delete-btn')) {
            const taskId = target.dataset.id;
            handleDeleteTask(taskId); //função delete pro CRUD
        }
    });
};

/**
 * Atualiza o painel de estatísticas (Inovação).
 * @param {Array} tasks - A lista de tarefas carregada do back-end.
 */
const updateStats = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.isDone).length;
    const pending = total - completed;

    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-completed').innerText = completed;
    document.getElementById('stat-pending').innerText = pending;
};

// --------------------------------------------------------
// INICIALIZAÇÃO E EVENT LISTENERS
// --------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    addGlobalListeners(); 
});

taskForm.addEventListener('submit', handleAddTask);