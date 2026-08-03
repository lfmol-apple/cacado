import db from "../config/dbConnect.js"

class  Grupo_Usuarios{

    constructor(dados){
        this.ID = dados?.ID;
        this.Nome = dados?.Nome;
        this.Ativo = dados?.Ativo != null? dados.Ativo: 1;
    }

    static async getAll(){
        const [rows] = await db.query('SELECT * FROM grupo_usuarios');
        return rows;
    }
    static async getAtivos(){
        const [rows] = await db.query("SELECT * FROM grupo_usuarios WHERE ATIVO = b'1'");
        return rows;
    }
    static async get(id){
        const [rows] = await db.query("SELECT * FROM grupo_usuarios WHERE ID = ?",[id]);
        return rows[0];
    }

    async Insert(){
        const Values = [this.Nome,this.Ativo];
        const[rows]  = await db.execute("INSERT INTO grupo_usuarios (NOME,ATIVO) VALUES (?,?)",Values);
        return rows.insertId

    }

    async Update(){
        const Values = [this.Nome, this.Ativo, this.ID];
        const[rows]  = await db.execute("UPDATE grupo_usuarios SET Nome = ?, Ativo = ? WHERE ID= ?;",Values);
        return this;
    }

    static async Existe(nome, ID = null){
        if (!ID){
            const[rows]  = await db.execute("SELECT COUNT(*) > 0 Existe FROM grupo_usuarios WHERE NOME = ?",[nome]);
            return rows[0].Existe;
        }
        const[rows]  = await db.execute("SELECT COUNT(*) > 0 Existe FROM grupo_usuarios WHERE NOME = ? AND ID <> ?",[nome,ID]);
        return rows[0].Existe;
    }
}

export default Grupo_Usuarios; 