// backend/pouchdb.js
const PouchDB = require('pouchdb');
const bcrypt = require('bcrypt'); 

// Usa a variável de ambiente POUCHDB_DIR, ou 'contratos' como padrão
const dbDir = process.env.POUCHDB_DIR || 'contratos';
const db = new PouchDB(dbDir);

// Função para adicionar um contrato
const addContrato = async (contrato) => {
  try {
    const response = await db.post(contrato);
    return response;
  } catch (error) {
    console.error('Erro ao adicionar contrato:', error);
    throw error;
  }
};

// Função para buscar todos os contratos
const getContratos = async () => {
  try {
    const response = await db.allDocs({ include_docs: true });
    const contratos = response.rows.map(row => row.doc);
    return contratos;
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    throw error;
  }
};

// Função para atualizar um contrato
const updateContrato = async (contrato) => {
  try {
    const response = await createUser(contrato);
    return response;
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error);
    throw error;
  }
};

// Função para deletar um contrato
const deleteContrato = async (contrato) => {
  try {
    const response = await db.remove(contrato);
    return response;
  } catch (error) {
    console.error('Erro ao deletar contrato:', error);
    throw error;
  }
};

// Função para criar um usuário
const createUser = async (username, password, role = 'user') => {
  try {
    // Verifica se o usuário já existe
    const existingUser = await db.get(username).catch(() => null);
    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o documento do usuário
    const user = {
      _id: username,
      password: hashedPassword,
      role: role,
    };

    // Salva o usuário no banco de dados
    const response = await createUser(user);
    return response;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

// Função para buscar um usuário pelo nome de usuário
const findUser = async (username) => {
  try {
    const user = await db.get(username);
    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
};

// Função para validar as credenciais de um usuário
const validateUser = async (username, password) => {
  try {
    const user = await findUser(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  } catch (error) {
    console.error('Erro ao validar usuário:', error);
    throw error;
  }
};

// Exporta as funções para usar em outros lugares
module.exports = {
  addContrato,
  getContratos,
  updateContrato,
  deleteContrato,
  createUser,
  findUser,
  validateUser,
};