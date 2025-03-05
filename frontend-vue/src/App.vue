<template>
  <div id="app">
    <nav>
      <router-link to="/painel-informacoes">Painel de Informações</router-link> |
      <router-link to="/cadastro-contratos">Contratos</router-link> 
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
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
  background: linear-gradient(135deg, #2c3e50, #34495e); /* Gradiente escuro */
  padding: 17px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra suave */
  position: fixed; /* Fixa a barra no topo */
  top: 0; /* Cola no topo da tela */
  left: 0; /* Alinha à esquerda */
  width: 100%; /* Ocupa toda a largura da tela */
  z-index: 1000; /* Garante que a barra fique acima de outros elementos */
}

/* Estilo para os links da navegação */
nav a {
  font-weight: bold;
  color: white; /* Cor do texto */
  text-decoration: none;
  margin: 0 10px;
  padding: 5px 10px;
  border-radius: 4px; /* Bordas arredondadas */
  transition: background-color 0.3s ease; /* Transição suave */
}

/* Efeito hover para os links da navegação */
nav a:hover {
  background-color: rgba(255, 255, 255, 0.1); /* Fundo branco com transparência */
}

/* Estilo para o link ativo */
nav a.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.2); /* Fundo branco com mais transparência */
  color: white; /* Cor do texto */
}
</style>