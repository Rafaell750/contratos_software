import { createRouter, createWebHistory } from 'vue-router';
import CadastroContratos from '../views/Cadastro_Contratos.vue';
import PainelInformacoes from '../views/Painel_Informacoes.vue';

const routes = [
  {
    path: '/cadastro-contratos',
    name: 'Cadastro_Contratos',
    component: CadastroContratos,
  },
  {
    path: '/painel-informacoes',
    name: 'Painel_Informacoes',
    component: PainelInformacoes,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;