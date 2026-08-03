import express from "express";
import validateJWT from "./jwtmiddleware.js";
import Tipo_DocumentoController from "../controllers/tipo_documentoController.js";

const router = express.Router();

router
    .get('/tipo_documento',validateJWT,Tipo_DocumentoController.ListaTiposDocumento)
    .get('/tipo_documento/:id',validateJWT,Tipo_DocumentoController.recuperaFormaPagamento);

export default router;