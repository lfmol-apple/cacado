import express from "express";
import validateJWT from "./jwtmiddleware.js";
import ConsultaCnpjController from "../controllers/consulta_cnpjController.js";

const router = express.Router();

router
    .get('/consulta_cnpj/:cnpj',validateJWT,ConsultaCnpjController.consulta)

 
export default router;