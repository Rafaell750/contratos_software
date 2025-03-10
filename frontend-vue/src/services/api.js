// frontend-vue/services/api.js

// Função para adicionar um contrato
export const addContrato = async (contrato) => {
    const response = await fetch('http://localhost:3000/contratos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contrato),
    });
    return response.json();
  };
  
  // Função para buscar todos os contratos
  export const getContratos = async () => {
    const response = await fetch('http://localhost:3000/contratos');
    return response.json();
  };
  
  // Função para atualizar um contrato
  export const updateContrato = async (contrato) => {
    const response = await fetch(`http://localhost:3000/contratos/${contrato._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contrato),
    });
    return response.json();
  };
  
  // Função para deletar um contrato
  export const deleteContrato = async (contrato) => {
    const response = await fetch(`http://localhost:3000/contratos/${contrato._id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contrato),
    });
    return response.json();
  };