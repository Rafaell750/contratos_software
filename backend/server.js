// backend/server.js
const express = require('express');
const { addContrato, getContratos, updateContrato, deleteContrato } = require('./pouchdb');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Rota para adicionar um contrato
app.post('/contratos', async (req, res) => {
  try {
    const contrato = req.body;
    const resultado = await addContrato(contrato);
    res.status(201).json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para buscar todos os contratos
app.get('/contratos', async (req, res) => {
  try {
    const contratos = await getContratos();
    res.status(200).json(contratos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para atualizar um contrato
app.put('/contratos/:id', async (req, res) => {
  try {
    const contrato = req.body;
    const resultado = await updateContrato(contrato);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para deletar um contrato
app.delete('/contratos/:id', async (req, res) => {
  try {
    const contrato = req.body;
    const resultado = await deleteContrato(contrato);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Backend rodando na porta 3000');
});