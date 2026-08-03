import Usuario from "../models/usuario.js";

class UsuarioController{

    static listaUsuarios(req,res){
        Usuario.getAll()
        .then(usuarios =>{
            res.status(200).json(usuarios);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static listaUsuariosAtivos(req,res){
        Usuario.getAtivos()
        .then(usuarios =>{
            res.status(200).json(usuarios);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static recuperaUsuario(req,res){
        const id = req.params.id;
        Usuario.Get(id)
        .then(usuario =>{
            res.status(200).json(usuario);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }
    static existeLogin(req,res){
        const id = req.params.id;
        const login = req.params.login;
        Usuario.existeLogin(login,id)
        .then(existe =>{
                res.status(200).json(existe);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

    static CadastraUsuario(req,res){
        let usuario = req.body;
        if(!usuario){
            res.status(400).send({message:`Dados de usuário inválidos`});
            return;
        }
        if(!usuario.IDGrupo_Usuarios){
            res.status(400).send({message:`Grupo do Usuário Inválido`});
            return;
        }
        if(!usuario.Nome){
            res.status(400).send({message:`Nome do Usuário Inválido`});
            return;
        }
        if(!usuario.Login){
            res.status(400).send({message:`Login do Usuário Inválido`});
            return;
        }
        if(!usuario.Senha){
            res.status(400).send({message:`Senha do Usuário Inválida`});
            return;
        }
        Usuario.existeLogin(usuario.Login)
        .then(existe =>{
            if(existe){
                res.status(400).send({message:`Já existe usuário com o login cadastrado`});
            }
            else{
                new Usuario(usuario).Insert()
                .then(usr =>{
                    res.status(200).json(usr);
                },err =>{
                    res.status(500).send({message:`Ocorreu um erro: ${err}`});
                })
            }
        })
    }
    static AtualizarUsuario(req,res){
        let usuario = req.body;
        if(!usuario){
            res.status(400).send({message:`Dados de usuário inválidos`});
            return;
        }
        if(!usuario.ID){
            res.status(400).send({message:`ID do usuário inválido`});
            return;
        }
        if(!usuario.IDGrupo_Usuarios){
            res.status(400).send({message:`Grupo do Usuário Inválido`});
            return;
        }
        if(!usuario.Nome){
            res.status(400).send({message:`Nome do Usuário Inválido`});
            return;
        }
        if(!usuario.Login){
            res.status(400).send({message:`Login do Usuário Inválido`});
            return;
        }
        Usuario.existeLogin(usuario.Login,usuario.ID)
        .then(existe =>{
            if(existe){
                res.status(400).send({message:`Já existe usuário com o login cadastrado`});
            }
            else{
                new Usuario(usuario).Update()
                .then(usr =>{
                    res.status(200).json(usr);
                },err =>{
                    res.status(500).send({message:`Ocorreu um erro: ${err}`});
                })
            }
        })
    }
    static Login(req,res){
        const dados = req.body;
        Usuario.GetByLoginSenha(dados.Login,dados.Senha)
        .then(usuario =>{
            if(usuario?.ID > 0){
                res.status(200).json(usuario);
            }
            else{
                res.status(400).send({auth:false,message:'Login ou Senha inválidos'});
            }
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }
    static AlteraSenha(req,res){
        const dados = req.body;
        Usuario.AlteraSenha(dados.ID,dados.NovaSenha)
        .then(usuario =>{
            if(usuario?.ID > 0){
                res.status(200).json(usuario);
            }
            else{
                res.status(400).send({message:'Não foi possível alterar a senha, verifique os dados'});
            }
        },err =>{
            res.status(500).send({message:`Ocorreu um erro: ${err}`});
        })
    }

}
export default UsuarioController;