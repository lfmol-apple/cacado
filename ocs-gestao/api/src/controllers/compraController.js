import Compra from "../models/compra.js"

class CompraController{

    static listaCompras(req,res){
        Compra.getAll()
        .then(compras =>{
            res.status(200).json(compras);
        },err=>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static listaPorFiltos(req,res){
        const _filtros = req.params.filtros;
        if(!_filtros){
            res.status(400).send({messagem:'Filtro inválido'});
            return;
        }
        const filtros = JSON.parse(_filtros);
        Compra.GetByFiltros(filtros)
        .then(compras =>{
            res.status(200).json(compras);
        },err=>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }
    static recuperaCompra(req,res){
        const id = req.params.id;
        Compra.Get(id)
        .then(compra =>{
            res.status(200).json(compra);
        },err=>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static cadastraCompra(req,res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;
        (dados.IDUsuCadastro);
        new Compra(dados).Insert()
        .then(compra =>{
            res.status(200).json(compra);
        },err=>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static atualizaCompra(req,res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;
        new Compra(dados).Update()
        .then(compra =>{
            res.status(200).json(compra);
        },err=>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static Delete(req,res){
        const id = req.params.id;
        Compra.Delete(id)
        .then(() =>{
            res.status(200).send({message:'Compra excluída com sucesso'});
        },err=>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })       
    }
}

export default CompraController;