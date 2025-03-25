<!-- frontend-vue/views/Painel_informações.vue -->
<template>
  <div class="container">
    <h1 class="titulo">Painel de Informações</h1>

    <!-- Card Centralizado com Todas as Informações -->
    <div class="card-informacao-centralizado">
      <div class="card-header">
        <h3>Resumo dos Contratos</h3>
      </div>
      <div class="card-body">
        <div class="info-item status-total">
          <span class="info-label">Total de Contratos:</span>
          <span class="info-value">{{ totalContratos }}</span>
        </div>
        <div class="info-item status-em-dia">
          <span class="info-label">Contratos em Dia:</span>
          <span class="info-value">{{ contratosEmDia }}</span>
        </div>
        <div class="info-item status-prestes-a-vencer">
          <span class="info-label">Contratos Prestes a Vencer:</span>
          <span class="info-value">{{ contratosPrestesAVencer }}</span>
        </div>
        <div class="info-item status-vencido">
          <span class="info-label">Contratos Vencidos:</span>
          <span class="info-value">{{ contratosVencidos }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getContratos } from '../services/api';

export default {
  data() {
    return {
      totalContratos: 0,
      contratosEmDia: 0,
      contratosPrestesAVencer: 0,
      contratosVencidos: 0,
    };
  },
  async created() {
    await this.carregarDados();
  },
  methods: {
    async carregarDados() {
      const contratos = await getContratos();
      this.totalContratos = contratos.length;

      // Calcula os status dos contratos
      contratos.forEach(contrato => {
        const status = this.calcularStatus(contrato.terminoPrazo);
        if (status === 'Em dia') {
          this.contratosEmDia++;
        } else if (status === 'Prestes a vencer') {
          this.contratosPrestesAVencer++;
        } else if (status === 'Vencido') {
          this.contratosVencidos++;
        }
      });
    },
    calcularStatus(terminoPrazo) {
      if (!terminoPrazo) return 'Sem data';

      const hoje = new Date();
      const termino = new Date(terminoPrazo);
      const diferencaDias = Math.floor((termino - hoje) / (1000 * 60 * 60 * 24));

      if (diferencaDias < 0) {
        return 'Vencido';
      } else if (diferencaDias <= 60) {
        return 'Prestes a vencer';
      } else {
        return 'Em dia';
      }
    },
  },
};
</script>

<style scoped>
/* Reutilize os estilos da página Cadastro_Contratos.vue */
@import './Cadastro_Contratos.css';

/* Estilos específicos para o card centralizado */
.card-informacao-centralizado {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  max-width: 500px;
  margin: 0 auto; /* Centraliza o card */
}

.card-informacao-centralizado:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-informacao-centralizado .card-header {
  padding: 15px;
  background-color: #658375; /* Verde */
  color: white;
  text-align: center;
}

.card-informacao-centralizado .card-body {
  padding: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #131212;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 1.1rem;
  color: #555;
}

.info-value {
  font-size: 1.2rem;
  font-weight: bold;
}

/* Cores para os status */
.status-total .info-value {
  color: #595a5a; /* Azul (cor padrão para o total) */
}

.status-em-dia .info-value {
  color: #42b983; /* Verde */
}

.status-prestes-a-vencer .info-value {
  color: #e48111; /* Laranja */
}

.status-vencido .info-value {
  color: #ff4d4d; /* Vermelho */
}
</style>