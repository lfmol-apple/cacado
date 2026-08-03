import express from "express";
import validateJWT from "./jwtmiddleware.js";
import RotaController from "../controllers/rotaController.js";
const router = express.Router();

router
    .get('/rota',validateJWT,RotaController.listaRotas)
    .get('/rota/:id',validateJWT,RotaController.recuperaRota)
    .get('/rota/grupo/:idgrupo',validateJWT,RotaController.recuperaRotasGrupo)
    .get('/rota/usuario/:idusuario',validateJWT,RotaController.recuperaRotasUsuario)
    .get('/rota/configuragrupo/:idrota/:idgrupo',validateJWT,RotaController.configuraGrupo)


export default router;