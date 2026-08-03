import express from "express";
import validateJWT from "./jwtmiddleware.js";
import Grupo_UsuariosController from "../controllers/grupo_usuariosController.js";

const router = express.Router();

router
    .get("/grupo_usuarios",validateJWT,Grupo_UsuariosController.listaGrupos)
    .get("/grupo_usuarios/:id",validateJWT,Grupo_UsuariosController.recuperaGrupo)
    .get("/grupo_usuarios_ativos",validateJWT,Grupo_UsuariosController.listaGruposAtivos)
    .post("/grupo_usuarios",validateJWT,Grupo_UsuariosController.cadastraGrupo)
    .put("/grupo_usuarios",validateJWT,Grupo_UsuariosController.atualizaGrupo)

export default router;