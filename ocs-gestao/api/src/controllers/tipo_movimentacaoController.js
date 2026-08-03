import Tipo_Movimentacao from "../models/tipo_movimentacao.js";

class Tipo_MovimentacaoController{
    static ListaTiposMovimentacao(req,res){
        Tipo_Movimentacao.GetAll()
        .then(tipos_movimentacao =>{
            res.status(200).json(tipos_movimentacao);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }
    static ListaTiposMovimentacaoAtivos(req,res){
        Tipo_Movimentacao.GetAtivos()
        .then(tipos_movimentacao =>{
            res.status(200).json(tipos_movimentacao);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }
    static RecuperaTipoMovimentaco(req,res){
        const id = req.params.id;
        Tipo_Movimentacao.Get(id)
        .then(tipo_movimentacao =>{
            res.status(200).json(tipo_movimentacao);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }

    static CadastraTipo_Movimentacao(req,res){
        const dados = req.body;
        new Tipo_Movimentacao(dados).Insert()
        .then(tipo_movimentacao =>{
            res.status(200).json(tipo_movimentacao);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }

    static AtualizaTipo_Movimentacao(req,res){
        const dados = req.body;
        new Tipo_Movimentacao(dados).Update()
        .then(tipo_movimentacao =>{
            res.status(200).json(tipo_movimentacao);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }    

    static VerificaNome(req,res){
        const Nome = req.params.nome;
        const ID = req.params.id;
        Tipo_Movimentacao.VerificaNome(Nome,ID)
        .then(existe =>{
            res.status(200).json(existe);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }    
}

export default Tipo_MovimentacaoController