// frontend-vue/services/api.js

const BASE_URL = 'http://localhost:3000'; // Usar o nome do serviço do backend
//const BASE_URL = 'http://172.16.21.12:3000'; // Para o servidor Docker

// Função auxiliar para obter o token do usuário logado
function getAuthToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
  }
  
  // Função para fazer requisições autenticadas
  async function fetchAuth(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      credentials: 'include'
    });
  
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
  
    return response.json();
  }
  
  export const addContrato = async (contrato) => {
    return fetchAuth(`${BASE_URL}/contratos`, {
      method: 'POST',
      body: JSON.stringify(contrato)
    });
  };
  
  export const getContratos = async () => {
    return fetchAuth(`${BASE_URL}/contratos`);
  };
  
  export const updateContrato = async (contrato) => {
    return fetchAuth(`${BASE_URL}/contratos/${contrato._id}`, {
      method: 'PUT',
      body: JSON.stringify(contrato)
    });
  };
  
  export const deleteContrato = async (contrato) => {
    return fetchAuth(`${BASE_URL}/contratos/${contrato._id}`, {
      method: 'DELETE',
      body: JSON.stringify(contrato)
    });
  };

  export const getHistorico = async () => {
    return fetchAuth(`${BASE_URL}/historico`);
  };