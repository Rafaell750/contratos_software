<template>
  <div class="historico-container">
    <h1>Histórico de Ações</h1>

    <FiltrosComponent
      ref="filtros"
      :config="{
        filtroAcao: true,
        filtroUsuario: true,
        filtroContrato: true,
        filtroData: true,
      }"
      @filtrar="filtrarHistorico"
    />

    <div class="historico-list">
      <div v-if="carregando" class="carregando">Carregando...</div>

      <div v-if="!carregando && historicoPaginado.length === 0" class="sem-registros">
        Nenhum registro encontrado
      </div>

      <div
        v-for="item in historicoPaginado"
        :key="item.id"
        class="historico-item"
        :class="{
          criacao: item.acao === 'CRIAR',
          atualizacao: item.acao === 'ATUALIZAR',
          exclusao: item.acao === 'DELETAR',
        }"
      >
        <div class="historico-grid">
          <div class="historico-cabecalho">
            <span class="acao">{{ formatarAcao(item.acao) }}</span>
            <span class="data">{{
              formatarDataBrasilia(item.createdAt_local || item.createdAt)
            }}</span>
          </div>

          <div class="usuario">
            <strong>Usuário:</strong> {{ item.usuario_nome }}
          </div>

          <div v-if="item.tabela === 'contratos'" class="detalhes">
            <div v-if="item.acao === 'CRIAR' || item.acao === 'ATUALIZAR'">
              <strong>Nº Contrato:</strong> {{ obterNumeroContrato(item.dados_novos) }}
            </div>
            <div v-else>
              <strong>Nº Contrato:</strong> {{ obterNumeroContrato(item.dados_anteriores) }}
            </div>
          </div>

          <div class="botao-container">
            <button
              v-if="item.dados_anteriores || item.dados_novos"
              @click="toggleDetalhes(item.id)"
              class="botao-detalhes"
            >
              {{ detalhesVisiveis[item.id] ? 'Ocultar' : 'Detalhes' }}
            </button>
          </div>
        </div>

        <div v-if="detalhesVisiveis[item.id]" class="detalhes-completos">
          <div class="detalhes-grid">
            <div v-if="item.dados_anteriores" class="detalhes-coluna">
              <h4>Dados anteriores:</h4>
              <div v-html="formatarDados(item.dados_anteriores)"></div>
            </div>

            <div v-if="item.dados_novos" class="detalhes-coluna">
              <h4>Dados novos:</h4>
              <div v-html="formatarDados(item.dados_novos)"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="totalPaginas > 1" class="paginacao">
  <button 
    @click="irParaPagina(paginaAtual - 1)"
    :disabled="paginaAtual === 1"
    class="botao-pagina botao-navegacao"
  >
    &lt;
  </button>
  
  <template v-for="pagina in paginasVisiveis">
    <button 
      v-if="pagina !== -1"
      :key="pagina"
      @click="irParaPagina(pagina)"
      :class="{ 
        'pagina-ativa': pagina === paginaAtual,
        'botao-pagina': true
      }"
    >
      {{ pagina }}
    </button>
    <span v-else :key="'separator'+pagina" class="separador-paginas">...</span>
  </template>
  
  <button 
    @click="irParaPagina(paginaAtual + 1)"
    :disabled="paginaAtual === totalPaginas"
    class="botao-pagina botao-navegacao"
  >
    &gt;
  </button>
</div>
    </div>
  </div>
</template>

<script>
import { getHistorico } from '../services/api';
import FiltrosComponent from './FiltrosComponent.vue';

export default {
  components: {
    FiltrosComponent,
  },
  data() {
    return {
      historico: [],
      historicoFiltrado: [],
      historicoPaginado: [],
      carregando: true,
      paginaAtual: 1,
      itensPorPagina: 10,
      detalhesVisiveis: {},
      maxPaginasExibidas: 6, // Numero máximo de paginas a serem exibidas
    };
  },
  computed: {
  totalPaginas() {
    return Math.ceil(this.historicoFiltrado.length / this.itensPorPagina);
  },
  paginasVisiveis() {
    const range = 1; // Quantas páginas mostrar ao redor da atual
    const paginas = [];
    const inicio = Math.max(2, this.paginaAtual - range);
    const fim = Math.min(this.totalPaginas - 1, this.paginaAtual + range);
    
    // Sempre mostra a primeira página
    paginas.push(1);
    
    // Adiciona "..." se houver um gap entre a primeira página e as páginas visíveis
    if (inicio > 2) {
      paginas.push(-1); // -1 representa o separador "..."
    }
    
    // Adiciona as páginas ao redor da atual
    for (let i = inicio; i <= fim; i++) {
      if (i !== 1 && i !== this.totalPaginas) {
        paginas.push(i);
      }
    }
    
    // Adiciona "..." se houver um gap entre as páginas visíveis e a última
    if (fim < this.totalPaginas - 1) {
      paginas.push(-1);
    }
    
    // Sempre mostra a última página se for diferente da primeira
    if (this.totalPaginas > 1) {
      paginas.push(this.totalPaginas);
    }
    
    return paginas;
  }
},
  async created() {
    await this.carregarHistorico();
  },
  methods: {
    async carregarHistorico() {
      try {
        this.carregando = true;
        this.historico = await getHistorico();
        this.filtrarHistorico();
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      } finally {
        this.carregando = false;
      }
    },
    filtrarHistorico() {
      const filtros = this.$refs.filtros.getFiltros();

      this.historicoFiltrado = this.historico.filter((item) => {
        const passaFiltroAcao = !filtros.acao || item.acao === filtros.acao;
        const passaFiltroUsuario =
          !filtros.usuario ||
          item.usuario_nome.toLowerCase().includes(filtros.usuario.toLowerCase());
        const passaFiltroContrato =
          !filtros.contrato ||
          this.obterNumeroContrato(item.dados_novos || item.dados_anteriores)
            .toLowerCase()
            .includes(filtros.contrato.toLowerCase());

        // Filtro por data
        let passaFiltroData = true;
        if (filtros.dataInicio || filtros.dataFim) {
          const dataItem = new Date(item.createdAt_local || item.createdAt);
          const dataItemISO = dataItem.toISOString().split('T')[0];

          if (filtros.dataInicio && dataItemISO < filtros.dataInicio) {
            passaFiltroData = false;
          }
          if (filtros.dataFim && dataItemISO > filtros.dataFim) {
            passaFiltroData = false;
          }
        }

        return passaFiltroAcao && passaFiltroUsuario && passaFiltroContrato && passaFiltroData;
      });

      this.paginaAtual = 1;
      this.atualizarPaginacao();
    },
    limparFiltrosDatas() {
      this.filtroDataInicio = '';
      this.filtroDataFim = '';
      this.filtrarHistorico();
    },
    atualizarPaginacao() {
      const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
      const fim = inicio + this.itensPorPagina;
      this.historicoPaginado = this.historicoFiltrado.slice(inicio, fim);
    },
    irParaPagina(pagina) {
      this.paginaAtual = pagina;
      this.atualizarPaginacao();
    },
    toggleDetalhes(id) {
      this.detalhesVisiveis = {
        ...this.detalhesVisiveis,
        [id]: !this.detalhesVisiveis[id],
      };
    },
    formatarAcao(acao) {
      const acoes = {
        CRIAR: 'Criação',
        ATUALIZAR: 'Atualização',
        DELETAR: 'Exclusão',
      };
      return acoes[acao] || acao;
    },
    formatarDataBrasilia(dataString) {
      if (!dataString) return '';

      try {
        const date = new Date(dataString);
        const offsetBrasilia = -0 * 60;
        const localOffset = date.getTimezoneOffset();
        const brasiliaTime = new Date(date.getTime() + (localOffset - offsetBrasilia) * 60000);

        return brasiliaTime.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      } catch (error) {
        console.error('Erro ao formatar data:', error, 'Data recebida:', dataString);
        return dataString;
      }
    },
    formatarDados(dados) {
      if (typeof dados === 'string') {
        try {
          dados = JSON.parse(dados);
        } catch {
          return dados;
        }
      }

      if (dados.numeroContrato) {
        return this.formatarContrato(dados);
      }

      return `<pre>${JSON.stringify(dados, null, 2)}</pre>`;
    },
    obterNumeroContrato(dados) {
      try {
        const contrato = typeof dados === 'string' ? JSON.parse(dados) : dados;
        return contrato?.numeroContrato || 'N/A';
      } catch (e) {
        console.error('Erro ao obter número do contrato:', e);
        return 'N/A';
      }
    },
    formatarContrato(contrato) {
      return `
          <div class="detalhes-contrato-horizontal">
            <span class="detalhes-item"><strong>Número:</strong> ${contrato.numeroContrato ||
              'N/A'}</span> |
            <span class="detalhes-item"><strong>Responsável:</strong> ${contrato.responsavel ||
              'N/A'}</span> |
            <span class="detalhes-item"><strong>Empresas:</strong> ${contrato.empresas ||
              'N/A'}</span> |
            <span class="detalhes-item"><strong>Início:</strong> ${contrato.inicioPrazo ||
              'N/A'}</span> |
            <span class="detalhes-item"><strong>Término:</strong> ${contrato.terminoPrazo ||
              'N/A'}</span> |
            <span class="detalhes-item"><strong>Valor:</strong> ${this.formatarValor(
              contrato.valor
            ) || 'N/A'}</span> |
            <span class="detalhes-item"><strong>Situação:</strong> ${contrato.situacao ||
              'N/A'}</span> |
            <span class="detalhes-item"><strong>Observações:</strong> ${contrato.observacoes ||
              'N/A'}</span>
          </div>
        `;
    },
    formatarValor(valor) {
      if (typeof valor === 'number') {
        return valor.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
      }
      return valor;
    },
  },
};
</script>

<style scoped>
.historico-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: rgba(245, 234, 234, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.historico-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.historico-item {
  background-color: white;
  border-radius: 8px;
  padding: 12px 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.historico-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  align-items: center;
  gap: 10px;
}

.historico-item.criacao {
  border-left: 4px solid #42b983;
}

.historico-item.atualizacao {
  border-left: 4px solid #2196F3;
}

.historico-item.exclusao {
  border-left: 4px solid #ff4d4d;
}

.historico-cabecalho {
  display: flex;
  flex-direction: column;
}

.acao {
  font-weight: bold;
  font-size: 0.95rem;
  color: #333;
  text-transform: capitalize;
}

.data {
  color: #666;
  font-size: 0.85rem;
}

.usuario,
.detalhes {
  font-size: 0.9rem;
  color: #555;
}

.usuario strong,
.detalhes strong {
  color: #333;
  font-weight: 600;
}

.botao-container {
  display: flex;
  justify-content: flex-end;
}

.botao-detalhes {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.botao-detalhes:hover {
  background-color: #369f6e;
}

.detalhes-completos {
  margin-top: 12px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e1e4e8;
  color: #333;
}

.detalhes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.detalhes-completos h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1rem;
  padding-bottom: 6px;
  border-bottom: 1px solid #e1e4e8;
}

.detalhes-coluna {
  background-color: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.detalhes-completos pre {
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f0f2f5;
  padding: 10px;
  border-radius: 4px;
  color: #333;
}

.carregando,
.sem-registros {
  text-align: center;
  padding: 20px;
  font-size: 1rem;
  color: #666;
}

.detalhes-contrato-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: 8px;
}

.detalhes-item {
  background-color: #f0f2f5;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
}

.detalhes-item strong {
  margin-right: 4px;
  font-weight: 600;
  color: #555;
}

.paginacao {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 8px;
  flex-wrap: wrap;
}

.botao-pagina {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.botao-pagina:hover {
  background-color: #f0f0f0;
}

.pagina-ativa {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.pagina-ativa:hover {
  background-color: #369f6e;
}

.botao-pagina.seta {
  font-weight: bold;
  font-size: 1rem;
}

.botao-pagina.seta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.separador-paginas {
  display: flex;
  align-items: center;
  padding: 0 8px;
  color: #666;
  user-select: none;
}

.botao-navegacao {
  font-weight: bold;
}

.botao-navegacao:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f0f0f0;
}

@media (max-width: 768px) {
  .detalhes-contrato-horizontal {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .detalhes-item {
    width: 100%;
  }

  .historico-container {
    padding: 15px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .filtros-superiores,
  .filtros-datas {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .filtros select,
  .filtros input,
  .filtros input[type="date"] {
    width: 100%;
  }

  .historico-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .botao-container {
    justify-content: flex-start;
    margin-top: 8px;
  }

  .historico-cabecalho {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .data-input {
    flex-direction: column;
    align-items: flex-start;
  }

  .data-input label {
    margin-bottom: -8px;
  }
}
</style>