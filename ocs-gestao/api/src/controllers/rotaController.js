import Rota from "../models/rota.js";
import RotaGrupoUsuarios from "../models/rota_grupo_usuarios.js";


class RotaController{

    static listaRotas(req,res){
        Rota.GetAll()
        .then(rotas =>{
            res.status(200).json(rotas);
        },
        err =>{
            res.status(500).send({Message:`Ocorreu um erro ${err}`});
        })
    }

    static recuperaRota(req,res){
        const id = req.params.id;
        Rota.Get(id)
        .then(rota =>{
            res.status(200).json(rota);
        },
        err =>{
            res.status(500).send({Message:`Ocorreu um erro ${err}`});
        })
    }

    static recuperaRotasGrupo(req,res){
        const idGrupo = req.params.idgrupo;        
        Rota.GetByGrupo(idGrupo)
        .then(rotas =>{
            res.status(200).json(rotas);
        },
        err =>{
            res.status(500).send({Message:`Ocorreu um erro ${err}`});
        })       
    }

    static recuperaRotasUsuario(req,res){
        const idUsuario = req.params.idusuario;        
        Rota.GetByUsuario(idUsuario)
        .then(rotas =>{
            res.status(200).json(rotas);
        },
        err =>{
            res.status(500).send({Message:`Ocorreu um erro ${err}`});
        })          
    }
    static configuraGrupo(req,res){
        const idRota = req.params.idrota;
        const idGrupo = req.params.idgrupo;
        RotaGrupoUsuarios.Configura(idRota,idGrupo)
        .then(result =>{
            res.status(200).json(result);
        },
        err =>{
            res.status(500).send({Message:`Ocorreu um erro ${err}`});
        })   
    }
}

export default RotaController;