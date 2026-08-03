import Fornecedor from "../models/fornecedor.js";

class FornecedorController{
    static ListaFornecedores(req,res){
        Fornecedor.GetAll()
        .then(fornecedores =>{
            res.status(200).json(fornecedores);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })

    }

    static ListaFornecedoresAtivos(req,res){
        Fornecedor.GetAtivos()
        .then(fornecedores =>{
            res.status(200).json(fornecedores);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })

    }

    static RecuperaFornecedor(req,res){
        const id = req.params.id;
        Fornecedor.Get(id)
        .then(fornecedor =>{
            res.status(200).json(fornecedor);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }

    static CadastraFornecedor(req,res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;
        if (dados.TipoPessoa != 0 && dados.TipoPessoa !=1){
            res.status(400).send({message:'Tipo de Pessoa inválido'})
            return;
        }
        if (dados.Nome == null){
            res.status(400).send({message:'Nome do Fornecedor inválido'})
            return;
        }
        Fornecedor.VerificaNome(dados.Nome)
        .then(Exite =>{
            if(Exite){
                res.status(400).send({message:'Já existe fornecedor cadastrado com este nome'})
                return;
            }
            if(dados.TipoPessoa == 0 && dados.RazaoSocial != null){
                Fornecedor.VerificaRazaoSocial(dados.RazaoSocial)
                .then(ExisteRazao =>{
                    if(ExisteRazao){
                        res.status(400).send({message:'Já existe fornecedor cadastrado com esta Razão Social'})
                        return;
                    }
                    new Fornecedor(dados).Insert()
                    .then(fornecedor =>{
                        res.status(200).json(fornecedor);
                    },err =>{
                        res.status(500).send({message:`Ocorreu um erro: ${err}`})
                    })  
                    return;                     
                })
            }
            else{

                new Fornecedor(dados).Insert()
                .then(fornecedor =>{
                    res.status(200).json(fornecedor);
                },err =>{
                    res.status(500).send({message:`Ocorreu um erro: ${err}`})
                })  
            }
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })

    }
    static AtualizaFornecedor(req,res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;
        if (!dados.ID){
            res.status(400).send({message:'ID do fornecedor inválido'})
            return;
        }
        if (dados.TipoPessoa != 0 && dados.TipoPessoa !=1){
            res.status(400).send({message:'Tipo de Pessoa inválido'})
            return;
        }
        if (dados.Nome == null){
            res.status(400).send({message:'Nome do Fornecedor inválido'})
            return;
        }
        Fornecedor.VerificaNome(dados.Nome,dados.ID)
        .then(Exite =>{
           
            if(Exite){
                res.status(400).send({message:'Já existe fornecedor cadastrado com este nome'})
                return;
            }
            if(dados.TipoPessoa == 0 && dados.RazaoSocial != null){
                Fornecedor.VerificaRazaoSocial(dados.RazaoSocial,dados.ID)
                .then(ExisteRazao =>{
                    if(ExisteRazao){
                        res.status(400).send({message:'Já existe fornecedor cadastrado com esta Razão Social'})
                        return;
                    }
                    new Fornecedor(dados).Update()
                    .then(fornecedor =>{
                        res.status(200).json(fornecedor);
                    },err =>{
                        res.status(500).send({message:`Ocorreu um erro: ${err}`})
                    })    
                    return;                    
                })
            }
            else{
                new Fornecedor(dados).Update()
                .then(fornecedor =>{
                    res.status(200).json(fornecedor);
                },err =>{
                    res.status(500).send({message:`Ocorreu um erro: ${err}`})
                })    
            }


        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })

    }
    static VerificaNome(req,res){
        const Nome = req.params.nome;
        const ID = req.params.id;
        Fornecedor.VerificaNome(Nome,ID)
        .then(existe =>{
            res.status(200).json(existe);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }
    static VerificaRazaoSocial(req,res){
        const RazaoSocial = req.params.razaosocial;
        if(RazaoSocial.trim() != null){
            const ID = req.params.id;
            Fornecedor.VerificaRazaoSocial(RazaoSocial,ID)
            .then(existe =>{
                res.status(200).json(existe);
            },err =>{
                res.status(500).send({message:`Ocorreu um erro: ${err}`})
            })
        }
        else{
               res.status(200).json(false);
             
        }
    }
    static GetAutoComplete(req,res){
        let dados = req.params.dados;
        Fornecedor.GetAutoComplete(dados)
        .then(fornecedores =>{
            res.status(200).json(fornecedores);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }    
}

export default FornecedorController