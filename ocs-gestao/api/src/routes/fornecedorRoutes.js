import express from "express";
import FornecedorController from "../controllers/fornecedorController.js";
import validateJWT from "./jwtmiddleware.js"

const router = express.Router();

router
    .get('/fornecedor',validateJWT,FornecedorController.ListaFornecedores)
    .get('/fornecedor/Ativos',FornecedorController.ListaFornecedoresAtivos)
    .get('/fornecedor/:id',FornecedorController.RecuperaFornecedor)
    .post('/fornecedor',FornecedorController.CadastraFornecedor)
    .put('/fornecedor',FornecedorController.AtualizaFornecedor)
    .get('/fornecedor/verificanome/:nome',FornecedorController.VerificaNome)
    .get('/fornecedor/verificanome/:nome/:id',FornecedorController.VerificaNome)
    .get('/fornecedor/verificarazaosocial/:razaosocial',FornecedorController.VerificaRazaoSocial)
    .get('/fornecedor/verificarazaosocial/:razaosocial/:id',FornecedorController.VerificaRazaoSocial)
    .get('/fornecedor/autocomplete/:dados',FornecedorController.GetAutoComplete)

export default router;