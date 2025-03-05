import PouchDB from 'pouchdb';

// Cria uma instância do PouchDB
const db = new PouchDB('contratos');

// Função para adicionar um contrato
export const addContrato = async (contrato) => {
  try {
    const response = await db.post(contrato);
    return response;
  } catch (error) {
    console.error('Erro ao adicionar contrato:', error);
    throw error;
  }
};

// Função para buscar todos os contratos
export const getContratos = async () => {
  try {
    const response = await db.allDocs({ include_docs: true });
    return response.rows.map(row => row.doc);
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    throw error;
  }
};

// Função para atualizar um contrato
export const updateContrato = async (contrato) => {
  try {
    const response = await db.put(contrato);
    return response;
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error);
    throw error;
  }
};

// Função para deletar um contrato
export const deleteContrato = async (contrato) => {
  try {
    const response = await db.remove(contrato);
    return response;
  } catch (error) {
    console.error('Erro ao deletar contrato:', error);
    throw error;
  }
};