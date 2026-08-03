import express from "express";
import validateJWT from "./jwtmiddleware.js";
import ProdutoController from "../controllers/produtoController.js";
const router = express.Router();

router
    .get('/produto',validateJWT,ProdutoController.ListaProdutos)
    .get('/produto/Ativos', validateJWT,ProdutoController.ListaProdutosAtivos)
    .get('/produto/:id',validateJWT,ProdutoController.RecuperaProduto)
    .get('/produto/autocomplete/:dados',validateJWT,ProdutoController.RecuperaParaAutoComplete)
    .get('/produto/existeNome/:nome',validateJWT,ProdutoController.ExisteNome)
    .get('/produto/existeNome/:nome/:id',validateJWT,ProdutoController.ExisteNome)
    .get('/produto/existeCodigoBarras/:codigobarras',validateJWT,ProdutoController.ExisteCodigoBarras)
    .get('/produto/existeCodigoBarras/:codigobarras/:id',validateJWT,ProdutoController.ExisteCodigoBarras)
    .post('/produto',validateJWT,ProdutoController.CadastraProduto)
    .put('/produto',validateJWT,ProdutoController.AtualizaProduto)

export default router;