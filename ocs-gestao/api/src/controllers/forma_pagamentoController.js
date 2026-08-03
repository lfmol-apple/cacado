import Forma_Pagamento from "../models/forma_pagamento.js"; 

class Forma_PagamentoController{

    static ListaFormasPagamento(req,res){
        Forma_Pagamento.getAll()
        .then(formas_pagamento =>{
            res.status(200).json(formas_pagamento);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro:${err}`})
        })
    }

    static recuperaFormaPagamento(req,res){
        const id = req.params.id;
        Forma_Pagamento.Get(id)
        .then(forma_pagamento =>{
            res.status(200).json(forma_pagamento);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro:${err}`})
        })
    }

}

export default Forma_PagamentoController;