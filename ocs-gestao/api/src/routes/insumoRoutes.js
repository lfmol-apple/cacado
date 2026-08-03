import express from "express";
import validateJWT from "./jwtmiddleware.js";
import InsumoController from "../controllers/insumoController.js";
const router = express.Router();

router
    .get('/insumo',validateJWT,InsumoController.ListaInsumos)
    .get('/insumo/Ativos', validateJWT,InsumoController.ListaInsumosAtivos)
    .get('/insumo/:id',validateJWT,InsumoController.RecuperaInsumo)
    .get('/insumo/autocomplete/:dados',validateJWT,InsumoController.RecuperaParaAutoComplete)
    .get('/insumo/existeNome/:nome',validateJWT,InsumoController.ExisteNome)
    .get('/insumo/existeNome/:nome/:id',validateJWT,InsumoController.ExisteNome)
    .post('/insumo',validateJWT,InsumoController.CadastraInsumo)
    .put('/insumo',validateJWT,InsumoController.AtualizaInsumo)

export default router;