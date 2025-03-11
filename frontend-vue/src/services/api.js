// frontend-vue/services/api.js

const BASE_URL = 'http://backend:3000'; // Usar o nome do serviço do backend

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