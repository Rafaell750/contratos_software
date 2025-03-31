<!-- frontend-vue/views/LoginPage.vue -->
<template>
    <div class="login-wrapper">
      <div class="login-container">
        <div class="login-header">
          <h1 class="titulo">Sistema de Contratos</h1>
          <p class="subtitulo">Acesse sua conta</p>
        </div>
  
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label for="username">Usuário</label>
            <input
              v-model="username"
              id="username"
              type="text"
              required
              class="form-input"
              placeholder="Digite seu usuário"
            >
          </div>
  
          <div class="form-group">
            <label for="password">Senha</label>
            <input
              v-model="password"
              id="password"
              type="password"
              required
              class="form-input"
              placeholder="Digite sua senha"
            >
          </div>
  
          <button type="submit" class="botao-login">
            Entrar
          </button>
  
          <p v-if="error" class="error-message">
            {{ error }}
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  export default {
    setup() {
      const username = ref('');
      const password = ref('');
      const error = ref('');
      const router = useRouter();
  
      const login = async () => {
        try {
          const response = await axios.post('http://localhost:3000/login', {
            username: username.value,
            password: password.value
          }, { withCredentials: true });
  
          localStorage.setItem('user', JSON.stringify(response.data));
          router.push('/cadastro-contratos');
        } catch (err) {
          error.value = err.response?.data?.error || 'Erro ao fazer login';
        }
      };
  
      return { username, password, error, login };
    }
  };
  </script>
  
  <style scoped>
  .login-wrapper {
    background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1px;
  }
  
  .login-container {
    background-color: rgba(245, 234, 234, 0.9);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    padding: 30px;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .titulo {
    font-size: 2rem;
    color: #333;
    margin-bottom: 10px;
  }
  
  .subtitulo {
    font-size: 1.2rem;
    color: #555;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .form-group label {
    font-weight: bold;
    color: #555;
    font-size: 1rem;
  }
  
  .form-input {
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
  
  .botao-login {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 10px;
  }
  
  .botao-login:hover {
    background-color: #369f6e;
  }
  
  .error-message {
    color: #ff4d4d;
    text-align: center;
    margin-top: 15px;
    padding: 10px;
    background-color: #ffebee;
    border-radius: 4px;
  }
  
  @media (max-width: 480px) {
    .login-container {
      padding: 20px;
    }
    
    .titulo {
      font-size: 1.8rem;
    }
  }
  </style>