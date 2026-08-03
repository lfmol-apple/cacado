import Movimentacao from "../models/movimentacao.js";

class MovimentacaoController{

    static recuperabyFiltros(req,res){
        const filtros = JSON.parse(req.params.filtros);
        Movimentacao.getByFiltros(filtros)
        .then( movimentacoes =>{
            res.status(200).json(movimentacoes)
        },
        err =>{
            res.status(500).send({message:`Ocorreu um erro:${err}`})
        })
    }

    static recuperaMovimentacao(req,res){
        const id = req.params.id;
        Movimentacao.Get(id)
        .then( movimentacao =>{
            res.status(200).json(movimentacao)
        },
        err =>{
            res.status(500).send({message:`Ocorreu um erro:${err}`})
        })        
    }

    static cadastraMovimentacao(req,res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;
        new Movimentacao(dados).Insert()
        .then( movimentacao =>{
            res.status(200).json(movimentacao)
        },
        err =>{
            res.status(500).send({message:`Ocorreu um erro:${err}`})
        })          
    }

    static atualizaMovimentacao(req,res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;
        new Movimentacao(dados).Update()
        .then( movimentacao =>{
            res.status(200).json(movimentacao)
        },
        err =>{
            res.status(500).send({message:`Ocorreu um erro:${err}`})
        })          
    }    

    static toggleConferido(req,res){
        const id = req.params.id;

        Movimentacao.toggleConferido(id, req.headers.userid)
        .then( () =>{
            res.status(200).send({message:'OK'});
        },
        err =>{
            res.status(500).send({message:`Ocorreu um erro:${err}`})
        })        
    }


    static excluiMovimentacao(req,res){
        const id = req.params.id;
        Movimentacao.Delete(id, req.headers.userid)
        .then( () =>{
            res.status(200).send({message:'OK'});;
        },
        err =>{
            res.status(500).send({message:`Ocorreu um erro:${err}`})
        })        
    }

}

export default MovimentacaoController