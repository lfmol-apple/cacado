import Venda from "../models/venda.js"

class VendaController{

    static listaVendas(req,res){
        Venda.getAll()
        .then(vendas =>{
            res.status(200).json(vendas);
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
        Venda.GetByFiltros(filtros)
        .then(vendas =>{
            res.status(200).json(vendas);
        },err=>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }   
    static recuperaVenda(req,res){
        const id = req.params.id;
        Venda.Get(id)
        .then(venda =>{
            res.status(200).json(venda);
        },err=>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static cadastraVenda(req,res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;
        new Venda(dados).Insert()
        .then(venda =>{
            res.status(200).json(venda);
        },err=>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static atualizaVenda(req,res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;
        new Venda(dados).Update()
        .then(venda =>{
            res.status(200).json(venda);
        },err=>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static Delete(req,res){
        const id = req.params.id;
         Venda.Delete(id)
        .then(() =>{
            res.status(200).send({message:'Venda excluída com sucesso'});
        },err=>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })       
    }
}

export default VendaController;