<script src="./Cadastro_Contratos.js"></script>
<style src="./Cadastro_Contratos.css" scoped></style>

<template>
  <div class="container">
    <h1 class="titulo">Contratos</h1>

    <!-- Botão para abrir a modal -->
    <button class="botao-cadastrar" @click="abrirModal">Cadastrar Contrato</button>

    <!-- Modal de Cadastro -->
    <div v-if="modalAberta" class="modal" :style="{ zIndex: modalAberta ? 1000 : 0 }">
      <div class="modal-conteudo">
        <span class="fechar" @click="fecharModal">&times;</span>
        <h2 class="modal-titulo">Cadastrar novo Contrato</h2>
        
        <!-- Formulário de Cadastro -->
        <form @submit.prevent="adicionarContrato" class="formulario">
          <div class="campo">
            <label for="numeroContrato">Nº do Contrato:</label>
            <input v-model="novoContrato.numeroContrato" id="numeroContrato" />
          </div>
          <div class="campo">
            <label for="responsavel">Responsável:</label>
            <input v-model="novoContrato.responsavel" id="responsavel" />
          </div>
          <div class="campo">
            <label for="empresas">Empresas:</label>
            <input v-model="novoContrato.empresas" id="empresas" />
          </div>
          <div class="campo">
            <label for="inicioPrazo">Início do Prazo:</label>
            <input v-model="novoContrato.inicioPrazo" type="date" id="inicioPrazo" />
          </div>
          <div class="campo">
            <label for="terminoPrazo">Término do Prazo:</label>
            <input v-model="novoContrato.terminoPrazo" type="date" id="terminoPrazo" />
          </div>
          <div class="campo">
            <label for="valor">Valor:</label>
            <input v-model="novoContrato.valor" @input="formatarEntradaValor" id="valor" />
          </div>
          <div class="campo">
            <label for="situacao">Situação:</label>
            <select v-model="novoContrato.situacao" id="situacao">
              <option value=""></option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Pendente">Pendente</option>
            </select>
          </div>
          <div class="campo">
            <label for="observacoes">Observações:</label>
            <textarea v-model="novoContrato.observacoes" id="observacoes" rows="3"></textarea>
          </div>

          <div class="botoes">
            <button type="submit" class="botao-salvar">{{ contratoSelecionado ? 'Atualizar' : 'Salvar' }}</button>
            <button type="button" @click="fecharModal" class="botao-cancelar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Informação -->
    <div v-if="modalInformacaoAberta" class="modal" :style="{ zIndex: modalInformacaoAberta ? 1001 : 0 }">
      <div class="modal-conteudo">
        <span class="fechar" @click="fecharModalInformacao">&times;</span>
        <h2 class="modal-titulo">Informações Adicionais</h2>
        <!-- Formulário de Informação -->
        <form @submit.prevent="salvarInformacao" class="formulario">
          <div class="campo">
            <label for="informacao"></label>
            <textarea v-model="informacaoAdicional" id="informacao" rows="5"></textarea>
          </div>
          <div class="botoes">
            <button type="submit" class="botao-salvar">Salvar</button>
            <button type="button" @click="fecharModalInformacao" class="botao-cancelar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Confirmação de Deletar -->
      <div v-if="modalConfirmacaoDeletar" class="modal modal-confirmacao">
        <div class="modal-conteudo">
          <span class="fechar" @click="fecharModalConfirmacaoDeletar">&times;</span>
          <h2 class="modal-titulo">Confirmar Remoção</h2>
          <p>Tem certeza que deseja deletar este contrato?</p>
          <div class="botoes">
            <button @click="confirmarDelecao" class="botao-salvar">Sim, deletar</button>
            <button @click="fecharModalConfirmacaoDeletar" class="botao-cancelar">Cancelar</button>
          </div>
        </div>
      </div>   

    <!-- Lista de Contratos Cadastrados -->
    <h2 class="subtitulo">Lista de Contratos:</h2>
    <div class="lista-contratos">
      <div v-for="contrato in contratos" :key="contrato._id" class="card-contrato">
        <div class="card-header" :class="`status-${calcularStatus(contrato.terminoPrazo).toLowerCase().replace(/ /g, '-')}`">
          <h3>Nº do Contrato: {{ contrato.numeroContrato }}</h3>

          <!-- Botão de três pontinhos -->
          <div class="menu-container">
            <button @click.stop="toggleMenu(contrato._id)" class="botao-menu">⋮</button>

            <!-- Dropdown de opções -->
            <div v-if="menuAberto === contrato._id" class="menu-opcoes">
              <button @click.stop="editarContrato(contrato)">✏️ Editar</button>
              <button @click.stop="deletarContrato(contrato)">❌ Deletar</button>
              <button @click.stop="abrirModalInformacao(contrato)">ℹ️ Informação</button>
            </div>
          </div>
        </div>



        <div class="card-body">
          <p><strong>Responsável:</strong> {{ contrato.responsavel }}</p>
          <p><strong>Empresas:</strong> {{ contrato.empresas }}</p>
          <p><strong>Início do Prazo:</strong> {{ formatarData(contrato.inicioPrazo) }}</p>

          <p>
            <strong>Término do Prazo:</strong> 
            {{ formatarData(contrato.terminoPrazo) }}
            <span :class="`status-${calcularStatus(contrato.terminoPrazo).toLowerCase().replace(/ /g, '-')}`">
              ({{ calcularStatus(contrato.terminoPrazo) }})
            </span>
          </p>

          <p><strong>Valor:</strong> R$ {{ formatarValor(contrato.valor) }}</p>
          <p>
            <strong>Situação:</strong>
            <span :class="`situacao-${contrato.situacao.toLowerCase()}`">{{ contrato.situacao }}</span>
          </p>
          <p><strong>Observações:</strong> {{ contrato.observacoes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


