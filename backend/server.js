// backend/server.js
const express = require('express');
const cookieParser = require('cookie-parser'); // Novo: para lidar com cookies
const cors = require('cors');

// Importações do seu sistema existente
const { addContrato, getContratos, updateContrato, deleteContrato } = require('./sqlite');

// Importações do novo sistema de autenticação
const { authenticate, isAdmin, db, generateToken, bcrypt, SALT_ROUNDS } = require('./auth');

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:8080', // Altere para o endereço do seu frontend
  credentials: true // Permite enviar cookies
}));
app.use(cookieParser()); // Habilita o parsing de cookies
app.use(express.json());

// ======================================
// NOVAS ROTAS DE AUTENTICAÇÃO (ADICIONE ESTA SEÇÃO)
// ======================================

// Rota de login ajustada para HTTP local
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = db.prepare('SELECT * FROM usuarios WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = generateToken(user);
  
  // Cookie otimizado para ambiente local HTTP
  res.cookie('token', token, { 
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000 // 8 horas de validade (opcional)
  });
  
  res.json({ 
    username: user.username,
    isAdmin: user.isAdmin
  });
});

// Rota de logout
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout realizado' });
});

// Rota para criar novos usuários (apenas admin)
app.post('/usuarios', authenticate, isAdmin, (req, res) => {
  const { username, password } = req.body;
  
  // Criptografa a senha
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  
  try {
    // Insere novo usuário
    const result = db.prepare(`
      INSERT INTO usuarios (username, password)
      VALUES (?, ?)
    `).run(username, hashedPassword);
    
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: 'Usuário já existe' });
  }
});

// ======================================
// SUAS ROTAS EXISTENTES (MODIFICADAS PARA USAR AUTENTICAÇÃO)
// ======================================

// Adiciona o middleware de autenticação a todas as rotas abaixo
app.use(authenticate);

app.get('/historico', authenticate, async (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT h.*, datetime(h.createdAt, 'localtime') as createdAt_local 
      FROM historico h
      ORDER BY h.createdAt DESC
    `);
    const historico = stmt.all();
    res.status(200).json(historico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para adicionar um contrato (agora requer autenticação)
app.post('/contratos', authenticate, async (req, res) => {
  try {
    const contrato = req.body;
    const resultado = await addContrato(contrato, req.user);
    res.status(201).json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para buscar todos os contratos (agora requer autenticação)
app.get('/contratos', async (req, res) => {
  try {
    const contratos = await getContratos();
    res.status(200).json(Array.isArray(contratos) ? contratos : []);
  } catch (err) {
    res.status(500).json([]);
  }
});

// Rota para atualizar um contrato (agora requer autenticação)
app.put('/contratos/:id', authenticate, async (req, res) => {
  try {
    const contrato = req.body;
    const resultado = await updateContrato(contrato, req.user);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para deletar um contrato (agora requer autenticação)
app.delete('/contratos/:id', authenticate, async (req, res) => {
  try {
    const contrato = req.body;
    const resultado = await deleteContrato(contrato, req.user);
    res.status(200).json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================
// INICIALIZAÇÃO DO SERVIDOR 
// ======================================

app.listen(3000, () => {
  console.log('Backend rodando na porta 3000');
});