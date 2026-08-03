import express from "express";
import validadeJWT from "./jwtmiddleware.js";
import grupo_usuarios from "./grupo_usuariosRoutes.js";
import usuario from "./usuarioRoutes.js";
import fornecedor from "./fornecedorRoutes.js"
import cliente from "./clienteRoutes.js"
import unidade_medida from "./unidade_medidaRoutes.js"
import produto from "./produtoRoutes.js"
import insumo from "./insumoRoutes.js"
import forma_pagamento from "./forma_pagamentoRoutes.js"
import tipo_documento from "./tipo_documentoRoutes.js"
import compra from "./compraRoutes.js"
import venda from "./vendaRoutes.js"
import consulta_cnpj from "./consulta_cnpjRoutes.js";
import tipo_movimentacao from "./tipo_movimentacaoRoutes.js"
import movimentacao from "./movimentacaoRoutes.js"
import rota from "./rotaRoutes.js"
import dashboard from "./dashboardRoutes.js"
import galpao from "./galpaoRouter.js";
import galpao_movimentacao from "./galpao_movimentacaoRoutes.js"
const routes = (app) =>{
    app.route('/').get((req,res) =>{
        res.status(200).send({titulo:"API OCS Gestão"})
    })

    app.use(
        express.json(),
        grupo_usuarios,
        usuario,
        fornecedor,
        cliente,
        unidade_medida,
        produto,
        insumo,
        forma_pagamento,
        tipo_documento,
        compra,
        venda,
        consulta_cnpj,
        tipo_movimentacao,
        movimentacao,
        rota,
        dashboard,
        galpao,
        galpao_movimentacao
    )
}

export default routes;