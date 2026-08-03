import express from "express";
import validateJWT from "./jwtmiddleware.js";
import VendaController from "../controllers/vendaController.js";

const router = express.Router();

router
    .get('/venda',validateJWT,VendaController.listaVendas)
    .get('/venda/busca/:filtros',validateJWT,VendaController.listaPorFiltos)
    .get('/venda/:id',validateJWT,VendaController.recuperaVenda)
    .post('/venda',validateJWT,VendaController.cadastraVenda)
    .put('/venda',validateJWT,VendaController.atualizaVenda)
    .delete('/venda/:id',validateJWT,VendaController.Delete)
 
export default router;