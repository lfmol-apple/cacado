// galpaoMovimentacaoController.js
import Galpao_Movimentacao from '../models/galpao_movimentacao.js';

class GalpaoMovimentacaoController {
  // Recuperar movimentação por ID
  static async getMovimentacaoById(req, res) {
    try {
      const movimentacao = await Galpao_Movimentacao.Get(req.params.id);
      res.status(200).json(movimentacao);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Recuperar movimentações por ID do galpão
  static async getMovimentacoesByGalpao(req, res) {
    try {
      const movimentacoes = await Galpao_Movimentacao.GetByGalpao(req.params.IDGalpao);
      res.status(200).json(movimentacoes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Recuperar movimentações por Data
  static async getMovimentacoesByData(req, res) {
    try {
      const movimentacoes = await Galpao_Movimentacao.GetByData(req.params.data);
      res.status(200).json(movimentacoes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  static async getByFiltros(req,res){
    try{
      let _filtros = req.params.filtros;
      console.log(_filtros);
      if(!_filtros){
        res.status(400).send({messagem:'Filtro inválido'});
        return;
      }
      const filtros = JSON.parse(_filtros);
      const movimentacoes = await Galpao_Movimentacao.GetByFiltros(filtros);
      res.status(200).json(movimentacoes)
    } catch(error){
      res.status(500).json({error: error.message})
    }
  }


  // Inserir uma nova movimentação
  static async createMovimentacao(req, res) {
    try {
      const { IDGalpao, Data, QtdOvos, QtdRacao, QtdMortes, IDUsuCadastro } = req.body;
      const novaMovimentacao = new Galpao_Movimentacao({
        IDGalpao,
        Data,
        QtdOvos,
        QtdRacao,
        QtdMortes,
        IDUsuCadastro,
        DtCadastro: new Date() // Usa a data atual para o cadastro
      });
      const movimentacaoInserida = await novaMovimentacao.Insert();
      res.status(201).json(movimentacaoInserida);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Atualizar uma movimentação existente
  static async updateMovimentacao(req, res) {
    try {
      const movimentacao = await Galpao_Movimentacao.Get(req.params.id);
      const { IDGalpao, Data, QtdOvos, QtdRacao, QtdMortes, IDUsuCadastro } = req.body;

      movimentacao.IDGalpao = IDGalpao;
      movimentacao.Data = Data;
      movimentacao.QtdOvos = QtdOvos;
      movimentacao.QtdRacao = QtdRacao;
      movimentacao.QtdMortes = QtdMortes;
      movimentacao.IDUsuCadastro = IDUsuCadastro;

      const movimentacaoAtualizada = await movimentacao.Update();
      res.status(200).json(movimentacaoAtualizada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Deletar uma movimentação existente
  static async deleteMovimentacao(req, res) {
    try {
      const sucesso = await Galpao_Movimentacao.Delete(req.params.id);
      res.status(200).json({ message: `Movimentação com ID ${req.params.id} deletada com sucesso` });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default GalpaoMovimentacaoController;
