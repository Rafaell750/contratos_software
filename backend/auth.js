// backend/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const db = new Database('contratos.db');

// Configurações
const JWT_SECRET = 'sua_chave_secreta_super_forte_123!@#';
const SALT_ROUNDS = 10;

// Inicializa tabela de usuários
db.prepare(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      isAdmin BOOLEAN DEFAULT FALSE,
      createdAt TEXT DEFAULT (datetime('now', 'localtime')),
      updatedAt TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `).run();

// Verifica se existe admin, se não, cria um
const adminExists = db.prepare('SELECT id FROM usuarios WHERE isAdmin = 1').get();
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', SALT_ROUNDS);
  db.prepare(`
    INSERT INTO usuarios (username, password, isAdmin)
    VALUES (?, ?, ?)
  `).run('admin', hashedPassword, 1); // Alterado true para 1
}

// Funções de autenticação
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Middleware de autenticação
function authenticate(req, res, next) {
  const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  req.user = decoded;
  next();
}

// Middleware de admin
function isAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
}

module.exports = {
  db,
  generateToken,
  verifyToken,
  authenticate,
  isAdmin,
  bcrypt,
  SALT_ROUNDS
};