// backend/sqlite.js
const Database = require('better-sqlite3');

// Configuração do banco de dados
const db = new Database('contratos.db');

// Inicializa o banco de dados com a tabela de contratos
db.prepare(`
  CREATE TABLE IF NOT EXISTS contratos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    _id TEXT UNIQUE,
    _rev TEXT,
    numeroContrato TEXT NOT NULL,
    responsavel TEXT,
    empresas TEXT,
    inicioPrazo TEXT,
    terminoPrazo TEXT,
    valor REAL,
    situacao TEXT,
    observacoes TEXT,
    informacaoAdicional TEXT,
    createdAt TEXT DEFAULT (datetime('now', 'localtime')),
    updatedAt TEXT DEFAULT (datetime('now', 'localtime'))
  )
`).run();

// Função para gerar IDs semelhantes aos do PouchDB
function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Função para adicionar um contrato
const addContrato = async (contrato) => {
  try {
    // Se não tiver _id, gera um novo
    if (!contrato._id) {
      contrato._id = generateId();
    }
    
    // Se for uma atualização, verifica se o contrato existe
    if (contrato._rev) {
      const existing = db.prepare('SELECT _rev FROM contratos WHERE _id = ?').get(contrato._id);
      if (!existing || existing._rev !== contrato._rev) {
        throw new Error('Conflito de revisão');
      }
    }
    
    // Gera nova revisão
    const newRev = generateId();
    
    // Fornece valor padrão para informacaoAdicional se não existir
    if (!contrato.informacaoAdicional) {
      contrato.informacaoAdicional = '';
    }
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO contratos (
        _id, _rev, numeroContrato, responsavel, empresas, 
        inicioPrazo, terminoPrazo, valor, situacao, 
        observacoes, informacaoAdicional, updatedAt
      ) VALUES (
        @_id, @_rev, @numeroContrato, @responsavel, @empresas,
        @inicioPrazo, @terminoPrazo, @valor, @situacao,
        @observacoes, @informacaoAdicional, datetime('now', 'localtime')
      )
    `);
    
    const result = stmt.run({
      ...contrato,
      _rev: newRev
    });
    
    return {
      id: result.lastInsertRowid,
      ok: true,
      rev: newRev
    };
  } catch (error) {
    console.error('Erro ao adicionar contrato:', error);
    throw error;
  }
};

// Função para buscar todos os contratos
const getContratos = async () => {
  try {
    const stmt = db.prepare('SELECT * FROM contratos ORDER BY createdAt DESC');
    const result = stmt.all();
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    return [];
  }
};

// Função para atualizar um contrato
const updateContrato = async (contrato) => {
  try {
    return await addContrato(contrato); // Reutiliza addContrato para atualização
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error);
    throw error;
  }
};

// Função para deletar um contrato
const deleteContrato = async (contrato) => {
  try {
    const stmt = db.prepare('DELETE FROM contratos WHERE _id = ? AND _rev = ?');
    const result = stmt.run(contrato._id, contrato._rev);
    
    if (result.changes === 0) {
      throw new Error('Documento não encontrado ou revisão incorreta');
    }
    
    return { ok: true, id: contrato._id };
  } catch (error) {
    console.error('Erro ao deletar contrato:', error);
    throw error;
  }
};

// Exporta as funções para usar em outros lugares
module.exports = { addContrato, getContratos, updateContrato, deleteContrato };