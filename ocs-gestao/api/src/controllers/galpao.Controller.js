// galpaoController.js
import Galpao from '../models/galpao.js';


class GalpaoController{

    
    static getAllGalpoes = async (req, res) => {
      try {
        const galpoes = await Galpao.GetAll();
        res.status(200).json(galpoes);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    
    static getGalpaoById = async (req, res) => {
      try {
        const galpao = await Galpao.Get(req.params.id);
        res.status(200).json(galpao);
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
    };
    
    static getGalpoesAtivos = async (req, res) => {
      try {
        const galpoesAtivos = await Galpao.GetAtivos();
        res.status(200).json(galpoesAtivos);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    
    static createGalpao = async (req, res) => {
      try {
        const { Nome, NumAves, Ativo } = req.body;
        const novoGalpao = new Galpao({ Nome, NumAves, Ativo });
        const galpaoInserido = await novoGalpao.Insert();
        res.status(201).json(galpaoInserido);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    
    static updateGalpao = async (req, res) => {
      try {
        const { Nome, NumAves, Ativo } = req.body;
        const galpaoExistente = await Galpao.Get(req.params.id);
        galpaoExistente.Nome = Nome;
        galpaoExistente.NumAves = NumAves;
        galpaoExistente.Ativo = Ativo;
        const galpaoAtualizado = await galpaoExistente.Update();
        res.status(200).json(galpaoAtualizado);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    
    static deleteGalpao = async (req, res) => {
      try {
        const sucesso = await Galpao.Delete(req.params.id);
        res.status(200).json({ message: `Galpão com ID ${req.params.id} deletado com sucesso` });
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
    };
}

export default GalpaoController