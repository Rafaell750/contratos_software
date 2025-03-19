import { createRouter, createWebHistory } from 'vue-router';
import CadastroContratos from '../views/Cadastro_Contratos.vue';
import PainelInformacoes from '../views/Painel_Informacoes.vue';
import LoginPage from '../views/LoginPage.vue'; // Atualize o nome da importação

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'LoginPage', // Atualize o nome da rota
    component: LoginPage,
  },
  {
    path: '/cadastro-contratos',
    name: 'Cadastro_Contratos',
    component: CadastroContratos,
    meta: { requiresAuth: true }, // Protege a rota
  },
  {
    path: '/painel-informacoes',
    name: 'Painel_Informacoes',
    component: PainelInformacoes,
    meta: { requiresAuth: true }, // Protege a rota
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Middleware de autenticação
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // Verifica se há um token no localStorage
  if (to.meta.requiresAuth && !token) {
    // Se a rota requer autenticação e não há token, redireciona para o login
    next('/login');
  } else {
    // Caso contrário, permite o acesso
    next();
  }
});

export default router;