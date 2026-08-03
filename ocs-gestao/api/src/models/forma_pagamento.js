import db from "../config/dbConnect.js";

class Forma_Pagamento{
    constructor(dados){
        this.ID = dados?.ID;
        this.Nome = dados?.Nome;
    }

    static async getAll(){
        var [rows] = await db.query('SELECT * FROM forma_pagamento ORDER BY NOME');
        return rows;
    }

    static async Get(id){
        var [rows] = await db.query('SELECT * FROM forma_pagamento WHERE ID = ?',[id]);
        return rows[0];
    }
}

export default Forma_Pagamento;