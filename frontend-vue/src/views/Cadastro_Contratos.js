// src/views/Cadastro_Contratos.js
import { addContrato, getContratos, deleteContrato } from '../services/api';
import FiltrosComponent from '../views/FiltrosComponent.vue'; // Adicione esta linha

export default {
  components: {
    FiltrosComponent // Registre o componente
  },
  data() {
    return {
      contratos: [],
      contratosFiltrados: [],
      modalAberta: false, // Controla a visibilidade da modal de cadastro
      modalInformacaoAberta: false, // Controla a visibilidade da modal de informação
      modalConfirmacaoDeletar: false, // Nova variável para controlar a modal de confirmação
      contratoParaDeletar: null, // Armazena o contrato que será deletado
      menuAberto: null, // Controla qual menu de opções está aberto
      informacaoAdicional: '', // Armazena as informações adicionais
      contratoSelecionado: null, // Armazena o contrato selecionado para adicionar informações
      novoContrato: {
        numeroContrato: '',
        responsavel: '',
        empresas: '',
        inicioPrazo: '',
        terminoPrazo: '',
        valor: '',
        situacao: '',
        observacoes: '',

      },

    };
  },
  async created() {
    await this.carregarContratos(); // Chama o método para carregar
  },

  mounted() {
    // Adiciona um evento de clique global para fechar o menu ao clicar fora
    document.addEventListener('click', this.fecharMenuAoClicarFora);
  },
  beforeUnmount() {
    // Remove o evento de clique global ao desmontar o componente
    document.removeEventListener('click', this.fecharMenuAoClicarFora);
  },

methods: {

  // Método para fechar o menu ao clicar fora
  fecharMenuAoClicarFora(event) {
    // Verifica se o clique foi dentro de um container de menu ou botão de menu
    const clicouDentroDoMenu = event.target.closest('.menu-container, .botao-menu');

    // Se não clicou dentro de um menu e algum menu está aberto, fecha ele
    if (!clicouDentroDoMenu && this.menuAberto !== null) {
        this.menuAberto = null;
    }
  },


    abrirModal() {
      this.contratoSelecionado = null; // Limpa o contrato selecionado
      this.modalAberta = true;
    },
    fecharModal() {
      this.modalAberta = false;
      this.novoContrato = { // Limpa o formulário
        numeroContrato: '',
        responsavel: '',
        empresas: '',
        inicioPrazo: '',
        terminoPrazo: '',
        valor: '',
        situacao: '',
        observacoes: '',
      };
    },
    async carregarContratos() {
      try {
        const response = await getContratos();
        this.contratos = Array.isArray(response) ? response : [];
        this.filtrarContratos(); // Aplica filtros iniciais (ou nenhum filtro)
      } catch (error) {
        console.error('Erro ao carregar contratos:', error);
        this.contratos = [];
        this.contratosFiltrados = [];
      }
    },

// Atualize este método para incluir o filtro de empresa
filtrarContratos() {
  // Verifica se o componente de filtros já foi renderizado
  if (!this.$refs.filtros) {
       this.contratosFiltrados = [...this.contratos];
       return;
  }
  const filtros = this.$refs.filtros.getFiltros();

  this.contratosFiltrados = this.contratos.filter(contrato => {
    // Filtro por Nº Contrato
    const passaFiltroContrato = !filtros.contrato ||
      (contrato.numeroContrato &&
       contrato.numeroContrato.toLowerCase().includes(filtros.contrato.toLowerCase()));

    // Filtro por Situação
    const passaFiltroSituacao = !filtros.situacao ||
      (contrato.situacao &&
      contrato.situacao.toLowerCase() === filtros.situacao.toLowerCase());

    // Filtro por Responsável (Usuário)
    const passaFiltroUsuario = !filtros.usuario ||
      (contrato.responsavel &&
       contrato.responsavel.toLowerCase().includes(filtros.usuario.toLowerCase()));

    // Filtro por Empresa
    const passaFiltroEmpresa = !filtros.empresa ||
      (contrato.empresas &&
       contrato.empresas.toLowerCase().includes(filtros.empresa.toLowerCase()));

    // --- INÍCIO DA CORREÇÃO DO FILTRO DE DATA ---
    let passaFiltroData = true;
    // Use a data relevante para o filtro (ex: terminoPrazo)
    const dataReferencia = contrato.terminoPrazo;

    // Só aplicamos lógica de filtro de data se alguma data foi preenchida no filtro
    if (filtros.dataInicio || filtros.dataFim) {
        // Se o contrato não possui a data que estamos usando para filtrar, ele não passa.
        if (!dataReferencia) {
            passaFiltroData = false;
        } else {
            // Verifica se a data de referência é ANTERIOR à data de início do filtro
            if (filtros.dataInicio && dataReferencia < filtros.dataInicio) {
                passaFiltroData = false;
            }
            // Verifica se a data de referência é POSTERIOR à data de fim do filtro
            // Fazemos essa verificação mesmo que a anterior tenha falhado,
            // mas o resultado final será false de qualquer jeito se uma delas falhar.
            if (filtros.dataFim && dataReferencia > filtros.dataFim) {
                passaFiltroData = false;
            }
        }
    }

        // Retorna true apenas se passar em TODOS os filtros aplicados
        return passaFiltroContrato &&
               passaFiltroUsuario &&
               passaFiltroSituacao &&
               passaFiltroEmpresa && // Inclui o resultado do filtro de empresa
               passaFiltroData;
      });
    },


    // Método para abrir a modal de confirmação de deleção
  abrirModalConfirmacaoDeletar(contrato) {
    this.contratoParaDeletar = contrato; // Armazena o contrato que será deletado
    this.modalConfirmacaoDeletar = true; // Abre a modal de confirmação
  },

  // Método para fechar a modal de confirmação de deleção
  fecharModalConfirmacaoDeletar() {
    this.modalConfirmacaoDeletar = false;
    this.contratoParaDeletar = null; // Limpa o contrato armazenado
  },

  // Método para confirmar a deleção
  async confirmarDelecao() {
    if (!this.contratoParaDeletar) {
      console.error('Nenhum contrato selecionado para deletar.');
      return;
    }

    try {
      await deleteContrato(this.contratoParaDeletar); // Deleta o contrato
      await this.carregarContratos(); // Recarrega e refiltra a lista

      // Fecha a modal de confirmação
      this.fecharModalConfirmacaoDeletar();

      // Limpa o contrato selecionado se ele foi deletado
      if (this.contratoSelecionado && this.contratoSelecionado._id === this.contratoParaDeletar._id) {
        this.contratoSelecionado = null;
      }
    } catch (error) {
      console.error('Erro ao deletar contrato:', error);
      alert('Erro ao deletar o contrato. Verifique o console para mais detalhes.'); // Informa o usuário
    }
  },

    // Método para calcular o status do contrato
  calcularStatus(terminoPrazo) {
    if (!terminoPrazo) return 'Sem data'; // Status padrão se não houver data

    // Garante que a comparação seja feita com a data correta (considerando UTC)
    const hoje = new Date();
    hoje.setUTCHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data

    // Converte a string da data de término para um objeto Date em UTC
    const [year, month, day] = terminoPrazo.split('-');
    const termino = new Date(Date.UTC(year, month - 1, day)); // Mês é 0-indexado

    // Calcula a diferença em milissegundos e converte para dias
    const diferencaMilissegundos = termino.getTime() - hoje.getTime();
    const diferencaDias = Math.ceil(diferencaMilissegundos / (1000 * 60 * 60 * 24)); // Use Math.ceil para incluir o dia atual

    if (diferencaDias < 0) {
        return 'Vencido';
    } else if (diferencaDias <= 60) { // Inclui 60 dias
        return 'Prestes a vencer';
    } else {
        return 'Em dia';
    }
  },


  formatarEntradaValor(event) {
    let valor = event.target.value;

    // Remove tudo que não for dígito ou vírgula
    valor = valor.replace(/[^\d,]/g, '');

    // Garante que a vírgula seja usada como separador decimal e haja apenas uma
    const partes = valor.split(',');
    if (partes.length > 2) {
        // Se houver mais de uma vírgula, mantém a primeira e remove as outras
        valor = partes[0] + ',' + partes.slice(1).join('');
    }
     // Limita a duas casas decimais
    if (partes[1] && partes[1].length > 2) {
        partes[1] = partes[1].substring(0, 2);
        valor = partes[0] + ',' + partes[1];
    }

    // Atualiza o valor no modelo
    this.novoContrato.valor = valor;
  },

  async adicionarContrato() {
      // Verifica se contratos é um array, se não, inicializa
  if (!Array.isArray(this.contratos)) {
    this.contratos = [];
  }
    // Verifica se já existe um contrato com o mesmo número, ignorando o contrato atual (se estiver editando)
    const contratoExistente = this.contratos.find(
      contrato =>
        contrato.numeroContrato === this.novoContrato.numeroContrato &&
        (!this.contratoSelecionado || contrato._id !== this.contratoSelecionado._id)
    );

    if (contratoExistente) {
      alert('Já existe um contrato com este número. Por favor, insira um número único.');
      return; // Interrompe a execução do método
    }

    // Verifica se a data de término é anterior à data de início
    if (this.novoContrato.inicioPrazo && this.novoContrato.terminoPrazo) {
        const inicioPrazo = new Date(this.novoContrato.inicioPrazo);
        const terminoPrazo = new Date(this.novoContrato.terminoPrazo);

        if (terminoPrazo < inicioPrazo) {
            alert('A data de término não pode ser anterior à data de início.');
            return; // Interrompe a execução do método
        }
    }


    // Prepara o objeto de contrato para salvar/atualizar
    const contratoParaSalvar = { ...this.novoContrato };


    // Converte o valor formatado (string com vírgula) para número (float com ponto)
    if (contratoParaSalvar.valor && typeof contratoParaSalvar.valor === 'string') {
        contratoParaSalvar.valor = parseFloat(contratoParaSalvar.valor.replace('.', '').replace(',', '.')) || 0;
    } else if (typeof contratoParaSalvar.valor !== 'number') {
        contratoParaSalvar.valor = 0; // Garante que seja um número ou zero
    }

    try {
      if (this.contratoSelecionado) {
        // Se estiver editando, inclui _id e _rev para atualização no CouchDB/PouchDB
        await addContrato({ ...contratoParaSalvar, _id: this.contratoSelecionado._id, _rev: this.contratoSelecionado._rev });
      } else {
        // Se não, adiciona um novo contrato
        await addContrato(contratoParaSalvar);
      }
      await this.carregarContratos(); // Recarrega e refiltra a lista
      this.fecharModal(); // Fecha a modal após sucesso
    } catch (error) {
       console.error('Erro ao salvar contrato:', error);
       alert('Erro ao salvar o contrato. Verifique os dados e tente novamente.'); // Informa o usuário sobre o erro
    }
  },

    // Método para deletar o contrato (apenas chama a modal de confirmação)
    async deletarContrato(contrato) {
      this.abrirModalConfirmacaoDeletar(contrato); // Abre a modal de confirmação
      // A deleção real acontece em confirmarDelecao()
      },

      formatarData(data) {
        if (!data) return '-';
        // Ajuste para garantir que a data seja interpretada corretamente (evitar problemas de timezone ao exibir)
        const [year, month, day] = data.split('-');
        if (!year || !month || !day) return '-'; // Retorna '-' se a data não estiver no formato esperado
        // Formata para dd/MM/yyyy
        return `${day}/${month}/${year}`;
      },
    formatarValor(valor) {
        // Verifica se o valor é um número antes de formatar
      if (typeof valor === 'number') {
        return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else if (typeof valor === 'string') {
          // Tenta converter string para número (se vier do DB como string)
          const numero = parseFloat(valor);
          if (!isNaN(numero)) {
             return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
      }
      // Retorna '0,00' ou um placeholder se o valor for inválido ou não numérico
      return '0,00';
    },

    // Alterna o menu de opções (Editar/Deletar)
  toggleMenu(contratoId) {
    if (this.menuAberto === contratoId) {
      // Se o menu já está aberto para este contrato, fecha-o
      this.menuAberto = null;
    } else {
      // Caso contrário, abre o menu para este contrato
      this.menuAberto = contratoId;
    }
  },

    editarContrato(contrato) {
      this.contratoSelecionado = { ...contrato }; // Clona o contrato selecionado para edição
       // Formata o valor de número para string com vírgula para exibição no input
      const valorFormatado = typeof contrato.valor === 'number'
        ? contrato.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', '') // Remove separador de milhar se houver
        : contrato.valor || ''; // Usa o valor como está se não for número

      this.novoContrato = { ...contrato, valor: valorFormatado }; // Preenche o formulário com os dados (valor formatado)
      this.modalAberta = true; // Abre a modal de cadastro para edição
      this.menuAberto = null; // Fecha o menu de opções
    },
        // Abre a modal de informação
        abrirModalInformacao(contrato) {
          this.contratoSelecionado = contrato;
          this.informacaoAdicional = contrato.informacaoAdicional || ''; // Carrega informações existentes, se houver
          this.modalInformacaoAberta = true;
          this.menuAberto = null; // Fecha o menu de opções
        },

        // Fecha a modal de informação
        fecharModalInformacao() {
          this.modalInformacaoAberta = false;
          this.contratoSelecionado = null;
          this.informacaoAdicional = '';
        },

        // Salva as informações adicionais
        async salvarInformacao() {
          if (this.contratoSelecionado) {
            // Prepara o objeto para atualização, incluindo _id e _rev
            const contratoParaAtualizar = {
                 ...this.contratoSelecionado,
                 informacaoAdicional: this.informacaoAdicional,
            };
             try {
                await addContrato(contratoParaAtualizar); // Atualiza o contrato no banco de dados
                await this.carregarContratos(); // Recarrega e refiltra
                this.fecharModalInformacao(); // Fecha a modal
             } catch(error) {
                console.error('Erro ao salvar informação adicional:', error);
                alert('Erro ao salvar informação adicional.');
             }
          }
        },

  },
};