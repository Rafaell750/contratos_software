<template>
    <div class="admin-wrapper">
      <div class="admin-container">
        <h1 class="titulo">Gerenciar Usuários</h1>
        
        <div class="admin-card">
          <h2 class="subtitulo">Criar Novo Usuário</h2>
          
          <form @submit.prevent="criarUsuario" class="user-form">
            <div class="form-group">
              <label for="newUsername">Usuário</label>
              <input
                v-model="newUser.username"
                id="newUsername"
                type="text"
                required
                class="form-input"
                placeholder="Digite o nome de usuário"
              >
            </div>
            
            <div class="form-group">
              <label for="newPassword">Senha</label>
              <input
                v-model="newUser.password"
                id="newPassword"
                type="password"
                required
                class="form-input"
                placeholder="Digite a senha"
              >
            </div>
            
            <div class="form-actions">
              <button type="submit" class="botao-primario">
                Criar Usuário
              </button>
            </div>
            
            <p v-if="message" :class="['mensagem-feedback', { 'erro': isError }]">
              {{ message }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      const newUser = ref({ username: '', password: '' });
      const message = ref('');
      const isError = ref(false);
  
      const criarUsuario = async () => {
        try {
          await axios.post('http://localhost:3000/usuarios', newUser.value, { 
            withCredentials: true 
          });
          message.value = 'Usuário criado com sucesso!';
          isError.value = false;
          newUser.value = { username: '', password: '' };
        } catch (err) {
          message.value = err.response?.data?.error || 'Erro ao criar usuário';
          isError.value = true;
        }
      };
  
      return { newUser, message, isError, criarUsuario };
    }
  };
  </script>
  
  <style scoped>
  .admin-wrapper {
    background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
    min-height: calc(100vh - 60px);
    padding: 20px;
  }
  
  .admin-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .titulo {
    font-size: 2rem;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .admin-card {
    background-color: rgba(245, 234, 234, 0.9);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 30px;
    margin-bottom: 30px;
  }
  
  .subtitulo {
    font-size: 1.5rem;
    color: #444;
    margin-bottom: 25px;
    text-align: center;
  }
  
  .user-form {
    max-width: 500px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #555;
  }
  
  .form-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #42b983;
    box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
  }
  
  .form-actions {
    display: flex;
    justify-content: center;
    margin-top: 25px;
  }
  
  .botao-primario {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .botao-primario:hover {
    background-color: #369f6e;
  }
  
  .mensagem-feedback {
    padding: 12px;
    border-radius: 6px;
    text-align: center;
    margin-top: 20px;
    font-size: 0.95rem;
  }
  
  .mensagem-feedback.erro {
    background-color: #ffebee;
    color: #c62828;
    border: 1px solid #ffcdd2;
  }
  
  .mensagem-feedback:not(.erro) {
    background-color: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #c8e6c9;
  }
  
  @media (max-width: 768px) {
    .admin-container {
      padding: 15px;
    }
    
    .admin-card {
      padding: 20px;
    }
    
    .titulo {
      font-size: 1.8rem;
    }
    
    .subtitulo {
      font-size: 1.3rem;
    }
  }
  </style>