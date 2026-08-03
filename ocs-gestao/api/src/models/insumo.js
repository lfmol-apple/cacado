import db from "../config/dbConnect.js"
import Unidade_Medida from "./unidade_medida.js";
import Usuario from "./usuario.js"

class  Insumo{
    constructor(dados){
        //ID, Nome, Descricao, IDUnidade_Medida, CodigoBarras, Valor, DtCadastro, IDUsuCadastro, Ativo
        this.ID = dados?.ID;
        this.Nome = dados?.Nome;
        this.Descricao = dados?.Descricao;
        this.IDUnidade_Medida = dados?.IDUnidade_Medida;
        this.DtCadastro = new Date();
        this.IDUsuCadastro = dados?.IDUsuCadastro,
        this.Ativo = dados?.Ativo? 1:0;
    }
    static async GetAll(){
        const [rows] = await db.query(`SELECT 
                                    insumo.*,
                                    unidade_medida.Nome as NomeUnidadeMedida,
                                    unidade_medida.Sigla as SiglaUnidadeMedida,
                                    usuario.NOME as NomeUsuCadastro
                                FROM insumo
                                INNER JOIN unidade_medida ON unidade_medida.ID = insumo.IDunidade_medida
                                INNER JOIN usuario ON usuario.ID = insumo.IDUSUCADASTRO
                                ORDER BY insumo.NOME `)
        return rows;
    }
    static async GetAtivos(){
        const [rows] = await db.query(`SELECT 
                                    insumo.*,
                                    unidade_medida.Nome as NomeUnidadeMedida,
                                    unidade_medida.Sigla as SiglaUnidadeMedida,
                                    usuario.NOME as NomeUsuCadastro
                                FROM insumo
                                INNER JOIN unidade_medida ON unidade_medida.ID = insumo.IDunidade_medida
                                INNER JOIN usuario ON usuario.ID = insumo.IDUSUCADASTRO
                                WHERE insumo.ATIVO = 1
                                ORDER BY insumo.NOME `)
        return rows;
    }
    static async Get(ID){
        let [rows] = await db.query(`SELECT 
                                    insumo.*,
                                    unidade_medida.Nome as NomeUnidadeMedida,
                                    unidade_medida.Sigla as SiglaUnidadeMedida,
                                    usuario.NOME as NomeUsuCadastro
                                FROM insumo
                                INNER JOIN unidade_medida ON unidade_medida.ID = insumo.IDunidade_medida
                                INNER JOIN usuario ON usuario.ID = insumo.IDUSUCADASTRO
                                WHERE insumo.ID = ?
                                ORDER BY insumo.NOME `,[ID]);

        let dados = rows[0];
        if(dados?.ID){
            dados.UsuarioCadastro = await Usuario.Get(dados.IDUsuCadastro);
            dados.Unidade_Medida = await Unidade_Medida.Get(dados.IDUnidade_Medida);
        }
        return dados;
    }

    static async GetAutoComplete(dados){
        const values = [`%${dados}%`,dados];
        const [rows] = await db.query(`SELECT 
                                            insumo.*,
                                            unidade_medida.Nome as NomeUnidadeMedida,
                                            unidade_medida.Sigla as SiglaUnidadeMedida,
                                            usuario.NOME as NomeUsuCadastro
                                        FROM insumo
                                        INNER JOIN unidade_medida ON unidade_medida.ID = insumo.IDunidade_medida
                                        INNER JOIN usuario ON usuario.ID = insumo.IDUSUCADASTRO
                                        WHERE insumo.NOME LIKE?
                                        AND insumo.ATIVO = b'1'
                                        ORDER BY insumo.NOME 
                                        LIMIT 10`,values);
        return rows;
    }

    async Insert(){
        const values = [this.Nome,this.Descricao,this.IDUnidade_Medida,this.DtCadastro,this.IDUsuCadastro,this.Ativo];
        const [rows] = await db.query(`INSERT INTO insumo
        (Nome, Descricao, IDUnidade_Medida,DtCadastro, IDUsuCadastro, Ativo)
        VALUES
        (?, ?, ?, ?, ?, ?)`,values);

        return  await  Insumo.Get(rows.insertId);
    }

    async Update(){
        const values = [this.Nome,this.Descricao,this.IDUnidade_Medida,this.DtCadastro,this.IDUsuCadastro,this.Ativo,this.ID];
        const [rows] = await db.query(`UPDATE insumo
        SET
            Nome = ?,
            Descricao = ?,
            IDUnidade_Medida = ?,
            DtCadastro = ?,
            IDUsuCadastro = ?,
            Ativo = ?
        WHERE ID= ?`,values);

        return await Insumo.Get(this.ID);
    }

    static async ExisteNome(nome,id=null){
        if(!id){
            const [rows] = await db.query(`SELECT COUNT(*) AS Existe FROM insumo WHERE NOME = ?`,[nome])
            return rows[0].Existe > 0;
        }
        const [rows] =  await  db.query(`SELECT COUNT(*) AS Existe FROM insumo WHERE NOME = ? AND ID <> ?`,[nome,id]);
        return rows[0].Existe > 0;
    }



}

export default Insumo;