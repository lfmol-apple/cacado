import grupo_usuarios from "../models/grupo_usuarios.js";

class Grupo_UsuariosController{
   static listaGrupos = (req,res) =>{
        grupo_usuarios.getAll()
        .then(grupos =>{
            res.status(200).json(grupos);
        },err =>{
            res.status(500).send(`Ocorreu um erro: ${err}`);
        })
    }
    static listaGruposAtivos = (req,res) =>{
        grupo_usuarios.getAtivos()
        .then(grupos =>{
            res.status(200).json(grupos);
        })
    }
    static recuperaGrupo = (req,res) =>{
        const id = req.params.id;
        grupo_usuarios.get(id)
        .then(grupo =>{
            res.status(200).json(grupo);
        })
    }
    static cadastraGrupo = (req,res) =>{
        let grupo = req.body;
        if (!grupo){res.status(400).send({message:"Dados do grupo inválidos"})}
        else if (!grupo.Nome){res.status(400).send({message:"Nome do grupo inválido"})}
        grupo_usuarios.Existe(grupo.Nome)
        .then(existe =>{
            if(existe > 0)
            {
                res.status(400).send({message:`Já existe grupo com o nome ${grupo.Nome} cadastrado`})
            }
            else{
                new grupo_usuarios(grupo).Insert()
                .then(id =>{
                    grupo.ID = id;
                    res.status(200).json(grupo);
                },err =>{
                    res.status(500).send({message:`Ocorreu um erro:${err}`})
                })
            }
        },err =>{
            res.status(500).send({message:`Ocorreu um erro:${err}`})
        })
    }

    static atualizaGrupo = (req,res) =>{
        let grupo = req.body;
        if (!grupo){
            res.status(400).send({message:"Dados do grupo inválidos"});
            return;
        }
        if (!grupo.Nome){
            res.status(400).send({message:"Nome do grupo inválido"});
            return;
        }
        if (!grupo.ID){
            res.status(400).send({message:"ID do grupo inválido"});
            return;
        }

        grupo_usuarios.Existe(grupo.Nome,grupo.ID)
        .then(existe =>{
            if(existe > 0)
            {
                res.status(400).send({message:`Já existe grupo com o nome ${grupo.Nome} cadastrado`})
            }
            else{
                new grupo_usuarios(grupo).Update()
                .then(gr =>{
                    res.status(200).json(gr);
                },err =>{
                    res.status(500).send({message:`Ocorreu um erro:${err}`})
                })
            }
        },err =>{
            res.status(500).send({message:`Ocorreu um erro:${err}`})
        })
    }

}

export default Grupo_UsuariosController