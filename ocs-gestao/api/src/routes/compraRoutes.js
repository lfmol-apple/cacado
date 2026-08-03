import express from "express";
import validateJWT from "./jwtmiddleware.js";
import CompraController from "../controllers/compraController.js";

const router = express.Router();

router
    .get('/compra',validateJWT,CompraController.listaCompras)
    .get('/compra/busca/:filtros',validateJWT,CompraController.listaPorFiltos)
    .get('/compra/:id',validateJWT,CompraController.recuperaCompra)
    .post('/compra',validateJWT,CompraController.cadastraCompra)
    .put('/compra',validateJWT,CompraController.atualizaCompra)
    .delete('/compra/:id',validateJWT,CompraController.Delete)
 
export default router;