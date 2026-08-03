import express from "express";
import validateJWT from "./jwtmiddleware.js";
import Unidade_MedidaController from "../controllers/unidade_medidaController.js";

const router = express.Router();

router
    .get('/unidade_medida',validateJWT,Unidade_MedidaController.ListaUnidades_Medida)
    .get('/unidade_medida/:id',validateJWT,Unidade_MedidaController.RecuperaUnidade_Medida)
    .get('/unidade_medida/nome/:nome',validateJWT,Unidade_MedidaController.RecuperaPorNome)
    .get('/unidade_medida/sigla/:sigla',validateJWT,Unidade_MedidaController.RecuperaPorSigla)
    .get('/unidade_medida/existeNome/:nome',validateJWT,Unidade_MedidaController.ExisteNome)
    .get('/unidade_medida/existeNome/:nome/:id',validateJWT,Unidade_MedidaController.ExisteNome)
    .get('/unidade_medida/existeSigla/:sigla',validateJWT,Unidade_MedidaController.ExisteSigla)
    .get('/unidade_medida/existeSigla/:sigla/:id',validateJWT,Unidade_MedidaController.ExisteSigla)
    .post('/unidade_medida',validateJWT,Unidade_MedidaController.CadastraUnidade_Medida)
    .put('/unidade_medida',validateJWT,Unidade_MedidaController.AtualizaUnidade_Medida)
    .delete('/unidade_medida/:id',validateJWT,Unidade_MedidaController.Delete)

export default router;