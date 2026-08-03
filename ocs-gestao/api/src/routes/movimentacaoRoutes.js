import express from "express"
import validateJWT from "./jwtmiddleware.js";
import MovimentacaoController from "../controllers/movimentacaoController.js"

const router = express.Router();

router
    .get('/movimentacao/:id',validateJWT,MovimentacaoController.recuperaMovimentacao)
    .get('/movimentacao/busca/:filtros',validateJWT,MovimentacaoController.recuperabyFiltros)
    .post('/movimentacao',validateJWT,MovimentacaoController.cadastraMovimentacao)
    .put('/movimentacao',validateJWT,MovimentacaoController.atualizaMovimentacao)
    .get('/movimentacao/toggleConferido/:id',validateJWT,MovimentacaoController.toggleConferido)
    .patch('/movimentacao/conferencia/:id',validateJWT,MovimentacaoController.toggleConferido)
    .delete('/movimentacao/:id',validateJWT,MovimentacaoController.excluiMovimentacao);

export default router;