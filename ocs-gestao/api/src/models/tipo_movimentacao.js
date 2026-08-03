import db from "../config/dbConnect.js";

class Tipo_Movimentacao{
    constructor(dados){
        console.log(dados);
        this.ID = dados?.ID;
        this.Nome = dados?.Nome;
        this.Credito = dados?.Credito? 1:0;
        this.Ativo = dados?.Ativo? 1:0;        
    }

    static async GetAll(){
        var [rows] = await db.query(`SELECT * FROM tipo_movimentacao ORDER BY NOME;`);
        return rows;
    }
    static async GetAtivos(){
        var [rows] = await db.query(`SELECT * FROM tipo_movimentacao WHERE ATIVO = b'1' ORDER BY NOME;`);
        return rows;
    }

    static async Get(id){
        var [rows] = await db.query(`SELECT * FROM tipo_movimentacao WHERE ID = ?`,[id]);
        return rows[0];
    }

    async Insert(){
        var [rows] = await db.query(`INSERT INTO tipo_movimentacao 
                                        (Nome,Credito,Ativo) 
                                        VALUES (?,?,?)`,[this.Nome,this.Credito,this.Ativo]);
        return Tipo_Movimentacao.Get(rows.insertId);
    }

    async Update(){

        await db.execute(`UPDATE tipo_movimentacao SET 
        Nome = ?, 
        Credito = ?,
        Ativo = ? 
        WHERE ID = ?`,[this.Nome,this.Credito,this.Ativo, this.ID]);
        return Tipo_Movimentacao.Get(this.ID);
    }
    
    static async VerificaNome(Nome,ID=null){
        if(!ID){
            const [rows] = await  db.query(`SELECT COUNT(*) AS ExisteNome FROM tipo_movimentacao WHERE NOME = ?`,[Nome]);
            
            return rows[0].ExisteNome > 0;
        }
        const [rows] = await db.query(`SELECT COUNT(*) AS ExisteNome FROM tipo_movimentacao WHERE NOME = ? AND ID <> ?`,[Nome,ID]);

        return rows[0].ExisteNome > 0;
    }
}

export default Tipo_Movimentacao;