import db from "../config/dbConnect.js";

class Tipo_Documento{
    constructor(dados){
        this.ID = dados?.ID;
        this.Nome = dados?.Nome;
    }

    static async getAll(){
        var [rows] = await db.query('SELECT * FROM tipo_documento ORDER BY NOME');
        return rows;
    }

    static async Get(id){
        var [rows] = await db.query('SELECT * FROM tipo_documento WHERE ID = ?',[id]);
        return rows[0];
    }
}

export default Tipo_Documento;