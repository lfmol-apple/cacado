import Cliente from "../models/cliente.js";

class ClienteController{
    static ListaClientes(req,res){
        Cliente.GetAll()
        .then(clientes =>{
            res.status(200).json(clientes);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })

    }

    static ListaClientesAtivos(req,res){
        Cliente.GetAtivos()
        .then(clientes =>{
            res.status(200).json(clientes);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })

    }

    static RecuperaCliente(req,res){
        const id = req.params.id;
        Cliente.Get(id)
        .then(cliente =>{
            res.status(200).json(cliente);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }

    static CadastraCliente(req,res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;
        if (dados.TipoPessoa != 0 && dados.TipoPessoa !=1){
            res.status(400).send({message:'Tipo de Pessoa inválido'})
            return;
        }
        if (dados.Nome == null){
            res.status(400).send({message:'Nome do Cliente inválido'})
            return;
        }
        Cliente.VerificaNome(dados.Nome)
        .then(Exite =>{
            if(Exite){
                res.status(400).send({message:'Já existe cliente cadastrado com este nome'})
                return;
            }
            if(dados.TipoPessoa == 0 && dados.RazaoSocial != null){
                Cliente.VerificaRazaoSocial(dados.RazaoSocial)
                .then(ExisteRazao =>{
                    if(ExisteRazao){
                        res.status(400).send({message:'Já existe cliente cadastrado com esta Razão Social'})
                        return;
                    }
                    new Cliente(dados).Insert()
                    .then(cliente =>{
                        res.status(200).json(cliente);
                    },err =>{
                        res.status(500).send({message:`Ocorreu um erro: ${err}`})
                    })  
                    return;                     
                })
            }
            else{

                new Cliente(dados).Insert()
                .then(cliente =>{
                    res.status(200).json(cliente);
                },err =>{
                    res.status(500).send({message:`Ocorreu um erro: ${err}`})
                })  
            }
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })

    }
    static AtualizaCliente(req,res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;        
        if (!dados.ID){
            res.status(400).send({message:'ID do cliente inválido'})
            return;
        }
        if (dados.TipoPessoa != 0 && dados.TipoPessoa !=1){
            res.status(400).send({message:'Tipo de Pessoa inválido'})
            return;
        }
        if (dados.Nome == null){
            res.status(400).send({message:'Nome do Cliente inválido'})
            return;
        }
        Cliente.VerificaNome(dados.Nome,dados.ID)
        .then(Exite =>{
            if(Exite){
                res.status(400).send({message:'Já existe cliente cadastrado com este nome'})
                return;
            }
            if(dados.TipoPessoa == 0 && dados.RazaoSocial != null){
                Cliente.VerificaRazaoSocial(dados.RazaoSocial,dados.ID)
                .then(ExisteRazao =>{
                    if(ExisteRazao){
                        res.status(400).send({message:'Já existe cliente cadastrado com esta Razão Social'})
                        return;
                    }
                    new Cliente(dados).Update()
                    .then(cliente =>{
                        res.status(200).json(cliente);
                    },err =>{
                        res.status(500).send({message:`Ocorreu um erro: ${err}`})
                    })    
                    return;                    
                })
            }
            new Cliente(dados).Update()
            .then(cliente =>{
                res.status(200).json(cliente);
            },err =>{
                res.status(500).send({message:`Ocorreu um erro: ${err}`})
            })    


        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })

    }
    static VerificaNome(req,res){
        const Nome = req.params.nome;
        const ID = req.params.id;
        Cliente.VerificaNome(Nome,ID)
        .then(existe =>{
            res.status(200).json(existe);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }
    static VerificaRazaoSocial(req,res){
        const RazaoSocial = req.params.razaosocial;
        const ID = req.params.id;
        Cliente.VerificaNome(RazaoSocial,ID)
        .then(existe =>{
            res.status(200).json(existe);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }
    
    static GetAutoComplete(req,res){
        let dados = req.params.dados;
        Cliente.GetAutoComplete(dados)
        .then(clientes =>{
            res.status(200).json(clientes);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }
}

export default ClienteController