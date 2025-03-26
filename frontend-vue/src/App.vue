<!-- frontend-vue/App.vue -->
<template>
  <div id="app">
    <nav v-if="$route.path !== '/'">
      <div class="nav-container">
        <div class="nav-links">
          <router-link to="/painel-informacoes">Painel de Informações</router-link> |
          <router-link to="/cadastro-contratos">Contratos</router-link> |
          <router-link 
            v-if="user?.isAdmin" 
            to="/admin/usuarios"
          >
            Admin
          </router-link>
        </div>
        <div class="user-info" v-if="user">
          <span class="username">👤 {{ user.username }}</span>
          <button @click="logout" class="logout-button">Sair</button>
        </div>
      </div>
    </nav>
    <router-view @user-updated="updateUser"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || null
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('user');
      this.user = null;
      this.$router.push('/');
    },
    updateUser() {
      this.user = JSON.parse(localStorage.getItem('user')) || null;
    }
  },
  mounted() {
    // Ouvir eventos de storage para detectar mudanças em outras abas
    window.addEventListener('storage', this.handleStorageEvent);
  },
  beforeUnmount() {
    // Remover o listener quando o componente for destruído
    window.removeEventListener('storage', this.handleStorageEvent);
  },
  created() {
    // Atualizar o usuário sempre que a rota mudar
    this.$router.afterEach(() => {
      this.updateUser();
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #f2f5f8;
  margin-top: 75px;
}

/* Estilo para a barra de navegação */
nav {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  padding: 17px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Estilo para os links da navegação */
nav a {
  font-weight: bold;
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

/* Efeito hover para os links da navegação */
nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Estilo para o link ativo */
nav a.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.username {
  font-weight: 600;
  color: white;
}

.logout-button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Ajuste para telas pequenas */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 10px;
  }
  
  .nav-links, .user-info {
    width: 100%;
    justify-content: center;
  }
}
</style>