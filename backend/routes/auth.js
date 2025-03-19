const express = require('express');
const { createUser, findUser, validateUser } = require('../pouchdb'); // Importa as funções do pouchdb.js
const bcrypt = require('bcrypt'); // ou bcryptjs
const router = express.Router();

// Rota para criar o administrador manualmente
router.post('/create-admin', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verifica se o administrador já existe
    const existingAdmin = await findUser(username);
    if (existingAdmin) {
      return res.status(400).json({ error: 'Administrador já existe' });
    }

    // Cria o administrador
    const admin = await createUser(username, password, 'admin');
    res.status(201).json({ message: 'Administrador criado com sucesso', admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para criar um usuário (somente admin)
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await createUser(username, password, role);
    res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await validateUser(username, password);
    if (user) {
      res.status(200).json({ message: 'Login bem-sucedido', user });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;