// galpaoMovimentacaoRoutes.js
import express from 'express';
import validateJWT from './jwtmiddleware.js';
import GalpaoMovimentacaoController from '../controllers/galpao_movimentacao.Controller.js';

const router = express.Router();

// Rota para recuperar movimentação por ID
router.get('/movimentacoes/:id', validateJWT, GalpaoMovimentacaoController.getMovimentacaoById);

// Rota para recuperar movimentações por galpão (IDGalpao)
router.get('/movimentacoes/galpao/:IDGalpao', validateJWT, GalpaoMovimentacaoController.getMovimentacoesByGalpao);

// Rota para recuperar movimentações por data
router.get('/movimentacoes/data/:data', validateJWT, GalpaoMovimentacaoController.getMovimentacoesByData);

router.get('/movimentacoes/busca/:filtros', validateJWT, GalpaoMovimentacaoController.getByFiltros)

// Rota para criar uma nova movimentação
router.post('/movimentacoes', validateJWT, GalpaoMovimentacaoController.createMovimentacao);

// Rota para atualizar uma movimentação existente
router.put('/movimentacoes/:id', validateJWT, GalpaoMovimentacaoController.updateMovimentacao);

// Rota para deletar uma movimentação
router.delete('/movimentacoes/:id', validateJWT, GalpaoMovimentacaoController.deleteMovimentacao);

export default router;
