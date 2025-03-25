<!-- frontend-vue/App.vue -->
<template>
  <div id="app">
    <nav v-if="$route.path !== '/'">
      <router-link to="/painel-informacoes">Painel de Informações</router-link> |
      <router-link to="/cadastro-contratos">Contratos</router-link> |
      <router-link 
        v-if="user?.isAdmin" 
        to="/admin/usuarios"
      >
        Admin
      </router-link>
    </nav>
    <router-view />
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
      // Implemente sua função de logout aqui
      localStorage.removeItem('user');
      this.$router.push('/');
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #f2f5f8;
  margin-top: 65px;
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

/* Estilo para os links da navegação */
nav a {
  font-weight: bold;
  color: white;
  text-decoration: none;
  margin: 0 10px;
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
</style>