import db from "../config/dbConnect.js"

class Unidade_Medida{
    constructor(dados){
        this.ID = dados?.ID;
        this.Nome = dados?.Nome;
        this.Sigla = dados?.Sigla;
    }

    static async GetAll(){
        const[rows] = await db.query(`SELECT * FROM unidade_medida ORDER BY NOME`);
        return rows;
    }
    static async Get(id){
        const[rows] = await db.query(`SELECT * FROM unidade_medida WHERE ID = ?`,[id]);
        return rows[0];
    }

    static async GetByNome(nome){
        const[rows] = await db.query(`SELECT * FROM unidade_medida WHERE NOME = ?`,[nome]);
        return rows[0];
    }
    static async GetBySigla(sigla){
        const[rows] = await db.query(`SELECT * FROM unidade_medida WHERE SIGLA = ?`,[sigla]);
        return rows[0];
    }

    static async ExisteNome(nome,id= null){
        const dados = await Unidade_Medida.GetByNome(nome);
        if(dados?.ID){
            if (id != null){
                return id != dados?.ID;
            }
            return true;
        }
        return false;
    }
    static async ExisteSigla(sigla,id= null){
        const dados = await Unidade_Medida.GetBySigla(sigla);
        if(dados?.ID){
            if (id != null){
                return id != dados?.ID;
            }
            return true;
        }
        return false;
    }

    async Insert(){
        const [rows] = await db.query(`INSERT INTO unidade_medida (NOME,SIGLA) VALUES (?,?)`, [this.Nome,this.Sigla]);
        return Unidade_Medida.Get(rows.insertId);
    }
    async Update(){
        const [rows] = await db.query(`UPDATE unidade_medida SET NOME = ?,SIGLA = ? WHERE ID = ?`, [this.Nome,this.Sigla,this.ID]);
        return Unidade_Medida.Get(this.ID);
    }

    static async Delete(id){
        db.execute(`DELETE FROM unidade_medida WHERE ID= ?`,[id]);
    }
}

export default Unidade_Medida