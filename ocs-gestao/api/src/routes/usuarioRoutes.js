import express from "express";
import validateJWT from "./jwtmiddleware.js";
import UsuarioController from "../controllers/usuarioController.js";

const router = express.Router();

router
    .get('/usuario',validateJWT,UsuarioController.listaUsuarios)
    .get('/usuario/ativos',validateJWT,UsuarioController.listaUsuariosAtivos)
    .get('/usuario/:id',validateJWT,UsuarioController.recuperaUsuario)
    .get('/usuario/existeLogin/:login/:id',validateJWT,UsuarioController.existeLogin)
    .get('/usuario/existeLogin/:login',validateJWT,UsuarioController.existeLogin)
    .post('/usuario',validateJWT,UsuarioController.CadastraUsuario)
    .put('/usuario',validateJWT,UsuarioController.AtualizarUsuario)
    .post('/usuario/login',UsuarioController.Login)
    .patch('/usuario/alteraSenha',validateJWT,UsuarioController.AlteraSenha)

export default router;