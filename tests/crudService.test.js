// tests/crudService.test.js

// 1. MOCK do firebaseConfig.js
// IMPORTANTE: O require('./firebase.setup.js') acontece AQUI DENTRO
// para evitar o erro de "out-of-scope variable".
jest.mock('../js/firebaseConfig.js', () => {
  const { db } = require('./firebase.setup.js'); // Require dentro do mock!
  
  return {
    tasksCollection: db.collection('tasks'),
    
    // Mock do firebaseApp para o serverTimestamp funcionar no teste
    firebaseApp: {
        firestore: {
            FieldValue: {
                serverTimestamp: () => new Date() 
            }
        }
    }
  };
});

// 2. Agora importamos o crudService e as ferramentas de teste normalmente
const { getTasks, addTask, updateTask, deleteTask } = require('../js/crudService.js');
const { db, cleanup } = require('./firebase.setup.js'); // Importamos aqui também para usar nos testes

const collectionName = 'tasks';

// Garantir que a coleção esteja limpa antes e depois de cada teste
beforeEach(async () => {
  await cleanup(collectionName);
});

afterAll(async () => {
  await cleanup(collectionName);
});

// --- TESTES DE CRIAÇÃO (CREATE) ---
describe('CREATE - addTask', () => {
  test('Deve adicionar uma nova tarefa ao Firestore e retornar o ID', async () => {
    const taskDescription = 'Tarefa de Teste: CREATE';
    const taskId = await addTask(taskDescription);

    // 1. Verifica se a função retornou um ID válido
    expect(taskId).toBeDefined();

    // 2. Verifica se o documento realmente foi criado no Firestore
    const doc = await db.collection(collectionName).doc(taskId).get();
    expect(doc.exists).toBe(true);

    // 3. Verifica se os dados salvos estão corretos
    const data = doc.data();
    expect(data.description).toBe(taskDescription);
    expect(data.isDone).toBe(false);
    expect(data.createdAt).toBeDefined(); 
  });

  test('Deve lançar um erro se a descrição estiver vazia', async () => {
    await expect(addTask('')).rejects.toThrow();
  });
});

// --- TESTES DE LEITURA (READ) ---
describe('READ - getTasks', () => {
  test('Deve retornar uma lista vazia quando não houver tarefas', async () => {
    const tasks = await getTasks();
    expect(tasks).toEqual([]);
  });

  test('Deve retornar todas as tarefas salvas', async () => {
    await db.collection(collectionName).add({ description: 'Task A', isDone: false, createdAt: new Date() });
    await db.collection(collectionName).add({ description: 'Task B', isDone: true, createdAt: new Date() });

    const tasks = await getTasks();

    expect(tasks.length).toBe(2);
    expect(tasks[0].id).toBeDefined(); 
  });
});

// --- TESTES DE ATUALIZAÇÃO (UPDATE) ---
describe('UPDATE - updateTask', () => {
  test('Deve atualizar o status isDone', async () => {
    const docRef = await db.collection(collectionName).add({ description: 'Task U', isDone: false, createdAt: new Date() });
    const taskId = docRef.id;

    await updateTask(taskId, { isDone: true });

    const updatedDoc = await db.collection(collectionName).doc(taskId).get();
    expect(updatedDoc.data().isDone).toBe(true);
  });
});

// --- TESTES DE EXCLUSÃO (DELETE) ---
describe('DELETE - deleteTask', () => {
  test('Deve remover uma tarefa do Firestore', async () => {
    const docRef = await db.collection(collectionName).add({ description: 'Task D', isDone: false, createdAt: new Date() });
    const taskId = docRef.id;

    await deleteTask(taskId);

    const deletedDoc = await db.collection(collectionName).doc(taskId).get();
    expect(deletedDoc.exists).toBe(false);
  });
});