const BASE_URL = 'http://localhost:3000'; // Para o ambiente de testes
//const BASE_URL = 'http://172.16.21.12:3000'; // Para o servidor Docker

// Funções existentes para contratos
export const addContrato = async (contrato) => {
  const response = await fetch(`${BASE_URL}/contratos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contrato),
  });
  return response.json();
};

export const getContratos = async () => {
  const response = await fetch(`${BASE_URL}/contratos`);
  return response.json();
};

export const updateContrato = async (contrato) => {
  const response = await fetch(`${BASE_URL}/contratos/${contrato._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contrato),
  });
  return response.json();
};

export const deleteContrato = async (contrato) => {
  const response = await fetch(`${BASE_URL}/contratos/${contrato._id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contrato),
  });
  return response.json();
};

// Novas funções para autenticação
export const login = async (username, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const register = async (username, password) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};