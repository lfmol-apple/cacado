import Tipo_Documento from "../models/tipo_documento.js";

class Tipo_DocumentoController{

    static ListaTiposDocumento(req,res){
        Tipo_Documento.getAll()
        .then(tipos_documento =>{
            res.status(200).json(tipos_documento);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro:${err}`})
        })
    }

    static recuperaFormaPagamento(req,res){
        const id = req.params.id;
        Tipo_Documento.Get(id)
        .then(tipo_documento =>{
            res.status(200).json(tipo_documento);
        },err =>{
            res.status(500).send({message:`Ocorreu um erro:${err}`})
        })
    }

}

export default Tipo_DocumentoController;