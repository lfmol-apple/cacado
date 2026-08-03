import Insumo from "../models/insumo.js";

class InsumoController{
    static ListaInsumos(req,res){
        Insumo.GetAll()
        .then(insumos =>{
            res.status(200).json(insumos);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }

    static ListaInsumosAtivos(req,res){
        Insumo.GetAtivos()
        .then(insumos =>{
            res.status(200).json(insumos);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }

    static RecuperaInsumo(req, res){
        const id = req.params.id;
        Insumo.Get(id)
        .then(insumo =>{
            res.status(200).json(insumo);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }

    static RecuperaParaAutoComplete(req,res){
        const dados = req.params.dados;
        Insumo.GetAutoComplete(dados)
        .then( insumos =>{
            res.status(200).json(insumos);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }

    static CadastraInsumo(req, res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;
        if(!dados?.Nome){
            res.status(400).send({message:`Nome do Insumo inválido`});
            return;
        }
        if(!dados?.IDUnidade_Medida){
            res.status(400).send({message:`Unidade de medida do Insumo inválido`});
            return;
        }

       
        Insumo.ExisteNome(dados.Nome)
        .then(ExisteNome =>{
            if(ExisteNome){
                res.status(400).send({message:`Já existe insumo cadastrado com este nome`});
                return;

            }
            new Insumo(dados).Insert()
            .then(insumo =>{
                res.status(200).json(insumo);
            },err =>{
                res.status(500).send({message:`Ocorreu um erro: ${err}`})
            })
        })
    }
    static AtualizaInsumo(req, res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;
        if(!dados?.ID){
            res.status(400).send({message:`ID do Insumo inválido`});
            return;
        }
        if(!dados?.Nome){
            res.status(400).send({message:`Nome do Insumo inválido`});
            return;
        }
        if(!dados?.IDUnidade_Medida){
            res.status(400).send({message:`Unidade de medida do Insumo inválido`});
            return;
        }
        
        Insumo.ExisteNome(dados.Nome,dados.ID)
        .then(ExisteNome =>{
            if(ExisteNome){
                res.status(400).send({message:`Já existe insumo cadastrado com este nome`});
                return;

            }
            new Insumo(dados).Update()
            .then(insumo =>{
                res.status(200).json(insumo);
            },err =>{
                res.status(500).send({message:`Ocorreu um erro: ${err}`})
            })
        })
    }

    static ExisteNome(req,res){
        const nome = req.params.nome;
        const id = req.params.id;

        Insumo.ExisteNome(nome,id)
        .then(existe =>{
            res.status(200).json(existe);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }

}

export default InsumoController;