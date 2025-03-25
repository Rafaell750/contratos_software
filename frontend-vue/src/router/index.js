//frontend-vue/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import CadastroContratos from '../views/Cadastro_Contratos.vue';
import PainelInformacoes from '../views/Painel_Informacoes.vue';


const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/cadastro-contratos',
    name: 'Cadastro_Contratos',
    component: CadastroContratos,
    meta: { requiresAuth: true }
  },
  {
    path: '/painel-informacoes',
    name: 'Painel_Informacoes',
    component: PainelInformacoes,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/usuarios',
    name: 'AdminUsuarios',
    component: () => import('../views/AdminUsuarios.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
  
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (to.meta.requiresAuth && !user) {
    next('/');
  } else if (to.meta.requiresAdmin && !user?.isAdmin) {
    next('/cadastro-contratos');
  } else {
    next();
  }
});



export default router;