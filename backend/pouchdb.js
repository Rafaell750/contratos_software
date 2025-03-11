// backend/pouchdb.js
const PouchDB = require('pouchdb');

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
    const response = await db.put(contrato);
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

// Exporta as funções para usar em outros lugares
module.exports = { addContrato, getContratos, updateContrato, deleteContrato };