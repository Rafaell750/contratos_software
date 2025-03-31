<!-- frontend-vue/views/FiltrosComponent.vue -->
<template>
  <div class="filtros-container"> 
    <div class="filtros">
       <!-- Título para a seção de filtros -->
       <h3 class="filtros-titulo">Opções de Filtros:</h3>
 
      <div class="filtros-superiores">
        <!-- Filtro dinâmico para ações/situações -->
        <select
          v-if="config.filtroAcao || config.filtroSituacao"
          v-model="filtroSelecionado"
          @change="$emit('filtrar')"
        >
          <option value="">Filtrar ações/situação</option>
          <option
            v-for="(opcao, index) in config.filtroAcao ? opcoesAcoes : opcoesSituacoes"
            :key="index"
            :value="opcao.value"
          >
            {{ opcao.text }}
          </option>
        </select>

        <!-- Filtro por usuário/responsável -->
        <input
          v-if="config.filtroUsuario"
          type="text"
          v-model="filtroUsuario"
          :placeholder="config.filtroUsuario.placeholder || 'Filtrar por usuário'"
          @input="$emit('filtrar')"
        >

        <!-- Filtro por contrato -->
        <input
          v-if="config.filtroContrato"
          type="text"
          v-model="filtroContrato"
          placeholder="Filtrar por nº contrato"
          @input="$emit('filtrar')"
        >

        <!-- Filtro por empresa -->
        <input
          v-if="config.filtroEmpresa"
          type="text"
          v-model="filtroEmpresa"
          placeholder="Filtrar por empresa"
          @input="$emit('filtrar')"
        >
      </div>

      <div class="filtros-datas" v-if="config.filtroData !== false">
        <div class="data-input">
          <label for="dataInicio">Data inicial:</label>
          <input
            type="date"
            id="dataInicio"
            v-model="filtroDataInicio"
            @change="$emit('filtrar')"
          >
        </div>

        <div class="data-input">
          <label for="dataFim">Data final:</label>
          <input
            type="date"
            id="dataFim"
            v-model="filtroDataFim"
            @change="$emit('filtrar')"
            :min="filtroDataInicio"
          >
        </div>

        <button
          class="botao-limpar"
          @click="limparFiltrosDatas"
        >
          Limpar datas
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// O Script permanece o mesmo
export default {
  name: 'FiltrosComponent',
  props: {
    config: {
      type: Object,
      default: () => ({
        filtroAcao: false,
        filtroSituacao: false,
        filtroUsuario: false,
        filtroContrato: false,
        filtroEmpresa: false,
        filtroData: true
      })
    }
  },
  data() {
    return {
      filtroSelecionado: '',
      filtroUsuario: '',
      filtroContrato: '',
      filtroEmpresa: '',
      filtroDataInicio: '',
      filtroDataFim: '',
      opcoesAcoes: [
        { value: 'CRIAR', text: 'Criações' },
        { value: 'ATUALIZAR', text: 'Atualizações' },
        { value: 'DELETAR', text: 'Exclusões' }
      ],
      opcoesSituacoes: [
        { value: 'Ativo', text: 'Ativo' },
        { value: 'Inativo', text: 'Inativo' },
        { value: 'Pendente', text: 'Pendente' }
      ]
    };
  },
  computed: {
    maxDate() {
      return new Date().toISOString().split('T')[0];
    }
  },
  methods: {
    limparFiltrosDatas() {
      this.filtroDataInicio = '';
      this.filtroDataFim = '';
      this.$emit('filtrar');
    },
    getFiltros() {
      return {
        acao: this.config.filtroAcao ? this.filtroSelecionado : null,
        situacao: this.config.filtroSituacao ? this.filtroSelecionado : null,
        usuario: this.filtroUsuario,
        contrato: this.filtroContrato,
        empresa: this.filtroEmpresa,
        dataInicio: this.filtroDataInicio,
        dataFim: this.filtroDataFim
      };
    },
    resetarFiltros() {
      this.filtroSelecionado = '';
      this.filtroUsuario = '';
      this.filtroContrato = '';
      this.filtroEmpresa = '';
      this.filtroDataInicio = '';
      this.filtroDataFim = '';
      this.$emit('filtrar');
    }
  }
};
</script>

<style scoped>
/* --- NOVO: Estilo do Container Principal --- */
.filtros-container {
  margin-bottom: 25px; /* Espaçamento abaixo do container de filtros */
}

/* --- ALTERADO: Estilo da "Janelinha" --- */
.filtros {
  background-color: #f8f9fa; /* Fundo levemente acinzentado */
  padding: 20px 25px;        /* Espaçamento interno */
  border: 1px solid #dee2e6; /* Borda sutil */
  border-radius: 8px;        /* Cantos arredondados */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Sombra leve */
  display: flex;
  flex-direction: column;    /* Organiza as linhas de filtro verticalmente */
  gap: 15px;                 /* Espaço entre a linha superior e a linha de datas */
  max-width: 1000px;         /* Largura máxima para não ficar muito largo em telas grandes */
  margin: 0 auto;            /* Centraliza o bloco na horizontal */
}

/* **** ADICIONADO: Estilo do Título **** */
.filtros-titulo {
  text-align: left;      /* Centraliza o texto */
  margin: 0 0 18px 0;      /* Remove margem superior/laterais, adiciona inferior */
  padding-bottom: 10px;   /* Espaço abaixo do texto antes da borda */
  font-size: 1.2rem;      /* Tamanho da fonte */
  font-weight: 600;        /* Peso da fonte (semi-bold) */
  color: #343a40;         /* Cor do texto */
  border-bottom: 1px solid #e0e0e0; /* Linha sutil abaixo */
}

/* --- ALTERADO: Centraliza itens nas linhas de filtro --- */
.filtros-superiores,
.filtros-datas {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center; /* Centraliza os itens horizontalmente */
}

/* --- Estilos dos Inputs e Labels (sem alterações) --- */
.data-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.data-input label {
  font-size: 0.9rem;
  color: #495057; /* Cor do texto um pouco mais escura */
  white-space: nowrap;
  font-weight: 500; /* Levemente mais pesado */
}

.filtros select,
.filtros input,
.filtros input[type="date"] {
  padding: 9px 14px; /* Levemente maior */
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: #fff; /* Fundo branco para os inputs */
  transition: border-color 0.2s, box-shadow 0.2s;
  min-width: 150px; /* Largura mínima para evitar que fiquem muito pequenos */
  box-sizing: border-box; /* Inclui padding e border na largura/altura total */
}

/* Adiciona um flex-grow para que os inputs se expandam um pouco se houver espaço */
.filtros-superiores input[type="text"],
.filtros-superiores select {
  flex-grow: 1;
  flex-basis: 180px; /* Base de largura antes de crescer */
}


.filtros select:focus,
.filtros input:focus,
.filtros input[type="date"]:focus {
  border-color: #86b7fe; /* Azul suave no foco */
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25); /* Sombra de foco padrão bootstrap */
  outline: none;
}

.botao-limpar {
  padding: 9px 15px;
  background-color: #42b983; 
  border: 1px solid #8d8f92;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #ffffff;
  transition: background-color 0.2s, border-color 0.2s;
}

.botao-limpar:hover {
  background-color: #dee2e6; /* Escurece um pouco no hover */
  border-color: #adb5bd;
}

/* --- ALTERADO: Responsividade --- */
@media (max-width: 768px) {
  .filtros {
    padding: 15px; /* Menos padding em telas menores */
  }

  .filtros-superiores,
  .filtros-datas {
    flex-direction: column; /* Empilha os itens verticalmente */
    gap: 12px;
    align-items: stretch;  /* Faz os itens ocuparem a largura total */
    justify-content: flex-start; /* Alinha ao início no modo coluna */
  }

  /* Inputs e select ocupam largura total no mobile */
  .filtros select,
  .filtros input,
  .filtros input[type="date"] {
    width: 100%;
    min-width: unset; /* Remove a largura mínima */
    flex-basis: auto; /* Reseta a base de largura */
  }

  .data-input {
    flex-direction: column;
    align-items: flex-start; /* Alinha label à esquerda */
    width: 100%;
  }

  .data-input label {
    margin-bottom: 5px; /* Espaço abaixo da label */
  }

  .botao-limpar {
      width: 100%; /* Botão ocupa largura total */
      margin-top: 5px;
  }
}
</style>