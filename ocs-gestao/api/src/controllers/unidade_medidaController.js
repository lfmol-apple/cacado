import Unidade_Medida from "../models/unidade_medida.js";

class Unidade_MedidaController{

    static ListaUnidades_Medida(req,res){
        Unidade_Medida.GetAll()
        .then(unidades_medida =>{
            res.status(200).json(unidades_medida);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static RecuperaUnidade_Medida(req,res){
        const id =  req.params.id;
        Unidade_Medida.Get(id)
        .then(unidade_medida =>{
            res.status(200).json(unidade_medida);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static RecuperaPorNome(req,res){
        const nome = req.params.nome;
        Unidade_Medida.GetByNome(nome)
        .then(unidade_medida =>{
            res.status(200).json(unidade_medida);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static RecuperaPorSigla(req,res){
        const sigla = req.params.sigla;
        Unidade_Medida.GetBySigla(sigla)
        .then(unidade_medida =>{
            res.status(200).json(unidade_medida);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static CadastraUnidade_Medida(req, res){
        const dados = req.body;
        if (!dados.Nome){
            res.status(400).send({message:`Nome Inválido`});
            return;
        }
        if (!dados.Sigla){
            res.status(400).send({message:`Sigla Inválida`});
            return;
        }
        Unidade_Medida.ExisteNome(dados.Nome)
        .then(existeNome =>{
            if(existeNome){
                res.status(400).send({message:`Já existe unidade de medida cadastrada com este nome`});
                return;              
            }
            Unidade_Medida.ExisteSigla(dados.Sigla)
            .then(existeSigla =>{
                if(existeSigla){
                    res.status(400).send({message:`Já existe unidade de medida cadastrada com esta sigla`});
                    return;                    
                }
                new Unidade_Medida(dados).Insert()
                .then(unidade_medida =>{
                    res.status(200).json(unidade_medida);
                },err =>{
                    res.status(500).send({message:`Ocorreu um erro: ${err}`});
                })
                return;                
            })
        })
    }
    static AtualizaUnidade_Medida(req, res){
        const dados = req.body;
        if(!dados.ID){
            res.status(400).send({message:`ID Inválido`});
            return;
        }
        if (!dados.Nome){
            res.status(400).send({message:`Nome Inválido`});
            return;
        }
        if (!dados.Sigla){
            res.status(400).send({message:`Sigla Inválida`});
            return;
        }
        Unidade_Medida.ExisteNome(dados.Nome,dados.ID)
        .then(existeNome =>{
            if(existeNome){
                res.status(400).send({message:`Já existe unidade de medida cadastrada com este nome`});
                return;              
            }
            Unidade_Medida.ExisteSigla(dados.Sigla,dados.ID)
            .then(existeSigla =>{
                if(existeSigla){
                    res.status(400).send({message:`Já existe unidade de medida cadastrada com esta sigla`});
                    return;                    
                }
                new Unidade_Medida(dados).Update()
                .then(unidade_medida =>{
                    res.status(200).json(unidade_medida);
                },err =>{
                    res.status(500).send({message:`Ocorreu um erro: ${err}`});
                })
                return;                
            })
        })
    }

    static ExisteNome(req,res){
        const nome = req.params.nome;
        const id = req.params.id;
        Unidade_Medida.ExisteNome(nome,id)
        .then(existe => {
            res.status(200).json(existe);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }
    static ExisteSigla(req,res){
        const sigla = req.params.sigla;
        const id = req.params.id;
        Unidade_Medida.ExisteSigla(sigla,id)
        .then(existe => {
            res.status(200).json(existe);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static Delete(req,res){
        const id = req.params.id;
        Unidade_Medida.Delete(id)
        .then( () =>{
            res.status(200).send({message:'Item excluído com sucess'})
        },err =>{
            res.status(500).send({message:`Não foi possível excluir o item: ${err}`});
        })
    }
}

export default Unidade_MedidaController;