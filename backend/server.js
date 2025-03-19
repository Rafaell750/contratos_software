// backend/server.js
const express = require('express');
const { addContrato, getContratos, updateContrato, deleteContrato } = require('./pouchdb');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

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

app.use('/auth', authRoutes);

// Rota protegida de exemplo
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Backend rodando na porta 3000');
});