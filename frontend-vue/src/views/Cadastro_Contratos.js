// src/views/Cadastro_Contratos.js
import { addContrato, getContratos, deleteContrato } from '../services/pouchdb';

export default {
  data() {
    return {
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
      contratos: [],
    };
  },
  async created() {
    this.contratos = await getContratos();
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
  const menuContainers = this.$el.querySelectorAll('.menu-container');
  const botaoMenus = this.$el.querySelectorAll('.botao-menu');

  let clicouFora = true;

  // Verifica se o clique foi dentro de algum menu ou botão de menu
  menuContainers.forEach(menuContainer => {
    if (menuContainer.contains(event.target)) {
      clicouFora = false;
    }
  });

  botaoMenus.forEach(botaoMenu => {
    if (botaoMenu.contains(event.target)) {
      clicouFora = false;
    }
  });

  // Se o clique foi fora de todos os menus e botões, fecha o menu
  if (clicouFora) {
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
    if (this.contratoParaDeletar) {
      await deleteContrato(this.contratoParaDeletar); // Deleta o contrato
      this.contratos = await getContratos(); // Atualiza a lista de contratos
      this.fecharModalConfirmacaoDeletar(); // Fecha a modal de confirmação

      // Limpa o contrato selecionado se ele foi deletado
      if (this.contratoSelecionado && this.contratoSelecionado._id === this.contratoParaDeletar._id) {
        this.contratoSelecionado = null;
      }
    }
  },

    // Método para calcular o status do contrato
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

  formatarEntradaValor(event) {
    let valor = event.target.value;
  
    // Remove todos os caracteres não numéricos, exceto a vírgula
    valor = valor.replace(/[^\d,]/g, '');
  
    // Garante que há apenas uma vírgula
    const partes = valor.split(',');
    if (partes.length > 1) {
      valor = partes[0] + ',' + partes[1].replace(/\D/g, ''); // Mantém apenas números após a vírgula
    } else {
      valor = partes[0]; // Sem vírgula, mantém apenas números
    }
  
    // Atualiza o valor no modelo
    this.novoContrato.valor = valor;
  },

  async adicionarContrato() {
    // Verifica se já existe um contrato com o mesmo número
    const contratoExistente = this.contratos.find(
      contrato => contrato.numeroContrato === this.novoContrato.numeroContrato
    );

    if (contratoExistente) {
      alert('Já existe um contrato com este número. Por favor, insira um número único.');
      return; // Interrompe a execução do método
    }

    // Verifica se a data de término é anterior à data de início
    const inicioPrazo = new Date(this.novoContrato.inicioPrazo);
    const terminoPrazo = new Date(this.novoContrato.terminoPrazo);

    if (terminoPrazo < inicioPrazo) {
      alert('A data de término não pode ser anterior à data de início.');
      return; // Interrompe a execução do método
    }

    // Garantir que o valor seja tratado como string antes de usar .replace
    if (this.novoContrato.valor !== undefined && this.novoContrato.valor !== null) {
      // Converte o valor para string, se não for
      const valorString = this.novoContrato.valor.toString();
      // Remove vírgulas e converte para número
      this.novoContrato.valor = parseFloat(valorString.replace(',', '.')) || 0;
    } else {
      // Se o valor for undefined ou null, define como 0
      this.novoContrato.valor = 0;
    }
  
    if (this.contratoSelecionado) {
      // Se estiver editando, atualiza o contrato existente
      await addContrato({ ...this.novoContrato, _id: this.contratoSelecionado._id, _rev: this.contratoSelecionado._rev });
    } else {
      // Se não, adiciona um novo contrato
      await addContrato(this.novoContrato);
    }
  
    this.fecharModal();
    this.contratos = await getContratos(); // Atualiza a lista de contratos
  },
    
    // Método para deletar o contrato (substitua o método antigo)
    async deletarContrato(contrato) {
      this.abrirModalConfirmacaoDeletar(contrato); // Abre a modal de confirmação
      this.contratos = await getContratos(); // Atualiza a lista de contratos
      },

    formatarData(data) {
      return data ? new Date(data).toLocaleDateString('pt-BR') : '-';
    },
    formatarValor(valor) {
      if (typeof valor === 'number') {
        return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else if (typeof valor === 'string') {
        return parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else {
        return '0,00'; // Retorna um valor padrão se o valor for inválido
      }
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
      this.novoContrato = { ...contrato }; // Preenche o formulário com os dados do contrato selecionado
      this.modalAberta = true; // Abre a modal de cadastro para edição
    },
        // Abre a modal de informação
        abrirModalInformacao(contrato) {
          this.contratoSelecionado = contrato;
          this.informacaoAdicional = contrato.informacaoAdicional || ''; // Carrega informações existentes, se houver
          this.modalInformacaoAberta = true;
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
            this.contratoSelecionado.informacaoAdicional = this.informacaoAdicional;
            await addContrato(this.contratoSelecionado); // Atualiza o contrato no banco de dados
            this.contratos = await getContratos(); // Atualiza a lista de contratos
            this.fecharModalInformacao();
          }
        },
        
  },
};