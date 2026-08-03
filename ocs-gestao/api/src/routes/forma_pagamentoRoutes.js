import express from "express";
import validateJWT from "./jwtmiddleware.js";
import Forma_PagamentoController from "../controllers/forma_pagamentoController.js";

const router = express.Router();

router
    .get('/forma_pagamento',validateJWT,Forma_PagamentoController.ListaFormasPagamento)
    .get('/forma_pagamento/:id',validateJWT,Forma_PagamentoController.recuperaFormaPagamento);

export default router;