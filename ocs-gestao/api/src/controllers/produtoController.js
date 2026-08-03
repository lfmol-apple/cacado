import Produto from "../models/produto.js";

class ProdutoController{
    static ListaProdutos(req,res){
        Produto.GetAll()
        .then(produtos =>{
            res.status(200).json(produtos);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }

    static ListaProdutosAtivos(req,res){
        Produto.GetAtivos()
        .then(produtos =>{
            res.status(200).json(produtos);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }

    static RecuperaProduto(req, res){
        const id = req.params.id;
        Produto.Get(id)
        .then(produto =>{
            res.status(200).json(produto);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }

    static RecuperaParaAutoComplete(req,res){
        const dados = req.params.dados;
        Produto.GetAutoComplete(dados)
        .then( produtos =>{
            res.status(200).json(produtos);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }

    static CadastraProduto(req, res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;
        if(!dados?.Nome){
            res.status(400).send({message:`Nome do Produto inválido`});
            return;
        }
        if(!dados?.IDUnidade_Medida){
            res.status(400).send({message:`Unidade de medida do Produto inválido`});
            return;
        }

        if(!dados?.Valor){
            dados.Valor = 0;
        }
        
        Produto.ExisteNome(dados.Nome)
        .then(ExisteNome =>{
            if(ExisteNome){
                res.status(400).send({message:`Já existe produto cadastrado com este nome`});
                return;

            }
            new Produto(dados).Insert()
            .then(produto =>{
                res.status(200).json(produto);
            },err =>{
                res.status(500).send({message:`Ocorreu um erro: ${err}`})
            })
        })
    }
    static AtualizaProduto(req, res){
        const dados = req.body;
        dados.IDUsuCadastro = req.headers.userid;
        if(!dados?.ID){
            res.status(400).send({message:`ID do Produto inválido`});
            return;
        }
        if(!dados?.Nome){
            res.status(400).send({message:`Nome do Produto inválido`});
            return;
        }
        if(!dados?.IDUnidade_Medida){
            res.status(400).send({message:`Unidade de medida do Produto inválido`});
            return;
        }

        if(!dados?.Valor){
            res.status(400).send({message:`Valor do Produto inválido`});
            return;
        }
        
        Produto.ExisteNome(dados.Nome,dados.ID)
        .then(ExisteNome =>{
            if(ExisteNome){
                res.status(400).send({message:`Já existe produto cadastrado com este nome`});
                return;

            }
            new Produto(dados).Update()
            .then(produto =>{
                res.status(200).json(produto);
            },err =>{
                res.status(500).send({message:`Ocorreu um erro: ${err}`})
            })
        })
    }

    static ExisteNome(req,res){
        const nome = req.params.nome;
        const id = req.params.id;

        Produto.ExisteNome(nome,id)
        .then(existe =>{
            res.status(200).json(existe);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }
    static ExisteCodigoBarras(req,res){
        const codigoBarras = req.params.codigobarras;
        const id = req.params.id;

        Produto.ExisteCodigoBarras(codigoBarras,id)
        .then(existe =>{
            res.status(200).json(existe);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`})
        })
    }
}

export default ProdutoController;