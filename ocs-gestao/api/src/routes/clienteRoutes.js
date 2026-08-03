import express from "express";
import validateJWT from "./jwtmiddleware.js";
import ClienteController from "../controllers/clienteController.js";

const router = express.Router();

router
    .get('/cliente',validateJWT,ClienteController.ListaClientes)
    .get('/cliente/Ativos',validateJWT,ClienteController.ListaClientesAtivos)
    .get('/cliente/:id',validateJWT,ClienteController.RecuperaCliente)
    .post('/cliente',validateJWT,ClienteController.CadastraCliente)
    .put('/cliente',validateJWT,ClienteController.AtualizaCliente)
    .get('/cliente/verificanome/:nome',validateJWT,ClienteController.VerificaNome)
    .get('/cliente/verificanome/:nome/:id',validateJWT,ClienteController.VerificaNome)
    .get('/cliente/verificarazaosocial/:razaosocial',validateJWT,ClienteController.VerificaRazaoSocial)
    .get('/cliente/verificarazaosocial/:razaosocial/:id',validateJWT,ClienteController.VerificaRazaoSocial)
    .get('/cliente/autocomplete/:dados',validateJWT,ClienteController.GetAutoComplete)

export default router;