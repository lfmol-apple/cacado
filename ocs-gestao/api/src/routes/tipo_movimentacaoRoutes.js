import express from "express";
import validateJWT from "./jwtmiddleware.js";
import Tipo_MovimentacaoController from "../controllers/tipo_movimentacaoController.js";

const router = express.Router();

router
    .get('/tipo_movimentacao',validateJWT,Tipo_MovimentacaoController.ListaTiposMovimentacao)
    .get('/tipo_movimentacao/ativos',validateJWT,Tipo_MovimentacaoController.ListaTiposMovimentacaoAtivos)
    .get('/tipo_movimentacao/:id',validateJWT,Tipo_MovimentacaoController.RecuperaTipoMovimentaco)
    .get('/tipo_movimentacao/VerificaNome/:nome/:id',validateJWT,Tipo_MovimentacaoController.VerificaNome)
    .post('/tipo_movimentacao',validateJWT,Tipo_MovimentacaoController.CadastraTipo_Movimentacao)
    .put('/tipo_movimentacao',validateJWT,Tipo_MovimentacaoController.AtualizaTipo_Movimentacao)

export default router;