import db from "../config/dbConnect.js"
import Unidade_Medida from "./unidade_medida.js";
import Usuario from "./usuario.js"
class  Produto{
    constructor(dados){
        //ID, Nome, Descricao, IDUnidade_Medida, CodigoBarras, Valor, DtCadastro, IDUsuCadastro, Ativo
        this.ID = dados?.ID;
        this.Nome = dados?.Nome;
        this.Descricao = dados?.Descricao;
        this.IDUnidade_Medida = dados?.IDUnidade_Medida;
        this.CodigoBarras = dados?.CodigoBarras;
        this.Valor = dados?.Valor;
        this.DtCadastro = new Date();
        this.IDUsuCadastro = dados?.IDUsuCadastro,
        this.Ativo = dados?.Ativo? 1:0;
    }
    static async GetAll(){
        const [rows] = await db.query(`SELECT 
                                    produto.*,
                                    unidade_medida.Nome as NomeUnidadeMedida,
                                    unidade_medida.Sigla as SiglaUnidadeMedida,
                                    usuario.NOME as NomeUsuCadastro
                                FROM produto
                                INNER JOIN unidade_medida ON unidade_medida.ID = produto.IDunidade_medida
                                INNER JOIN usuario ON usuario.ID = produto.IDUSUCADASTRO
                                ORDER BY produto.NOME `)
        return rows;
    }
    static async GetAtivos(){
        const [rows] = await db.query(`SELECT 
                                    produto.*,
                                    unidade_medida.Nome as NomeUnidadeMedida,
                                    unidade_medida.Sigla as SiglaUnidadeMedida,
                                    usuario.NOME as NomeUsuCadastro
                                FROM produto
                                INNER JOIN unidade_medida ON unidade_medida.ID = produto.IDunidade_medida
                                INNER JOIN usuario ON usuario.ID = produto.IDUSUCADASTRO
                                WHERE produto.ATIVO = 1
                                ORDER BY produto.NOME `)
        return rows;
    }
    static async Get(ID){
        let [rows] = await db.query(`SELECT 
                                    produto.*,
                                    unidade_medida.Nome as NomeUnidadeMedida,
                                    unidade_medida.Sigla as SiglaUnidadeMedida,
                                    usuario.NOME as NomeUsuCadastro
                                FROM produto
                                INNER JOIN unidade_medida ON unidade_medida.ID = produto.IDunidade_medida
                                INNER JOIN usuario ON usuario.ID = produto.IDUSUCADASTRO
                                WHERE produto.ID = ?
                                ORDER BY produto.NOME `,[ID]);

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
                                            produto.*,
                                            unidade_medida.Nome as NomeUnidadeMedida,
                                            unidade_medida.Sigla as SiglaUnidadeMedida,
                                            usuario.NOME as NomeUsuCadastro
                                        FROM produto
                                        INNER JOIN unidade_medida ON unidade_medida.ID = produto.IDunidade_medida
                                        INNER JOIN usuario ON usuario.ID = produto.IDUSUCADASTRO
                                        WHERE (produto.NOME LIKE? OR produto.CodigoBarras = ?)
                                        AND produto.ATIVO = b'1'
                                        ORDER BY produto.NOME 
                                        LIMIT 10`,values);
        return rows;
    }

    async Insert(){
        const values = [this.Nome,this.Descricao,this.IDUnidade_Medida,this.CodigoBarras,this.Valor,this.DtCadastro,this.IDUsuCadastro,this.Ativo];
        const [rows] = await db.query(`INSERT INTO produto
        (Nome, Descricao, IDUnidade_Medida, CodigoBarras, Valor, DtCadastro, IDUsuCadastro, Ativo)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)`,values);

        return  await  Produto.Get(rows.insertId);
    }

    async Update(){
        const values = [this.Nome,this.Descricao,this.IDUnidade_Medida,this.CodigoBarras,this.Valor,this.DtCadastro,this.IDUsuCadastro,this.Ativo,this.ID];
        const [rows] = await db.query(`UPDATE produto
        SET
            Nome = ?,
            Descricao = ?,
            IDUnidade_Medida = ?,
            CodigoBarras = ?,
            Valor = ?,
            DtCadastro = ?,
            IDUsuCadastro = ?,
            Ativo = ?
        WHERE ID= ?`,values);

        return await Produto.Get(this.ID);
    }

    static async ExisteNome(nome,id=null){
        if(!id){
            const [rows] = await db.query(`SELECT COUNT(*) AS Existe FROM produto WHERE NOME = ?`,[nome])
            return rows[0].Existe > 0;
        }
        const [rows] =  await  db.query(`SELECT COUNT(*) AS Existe FROM produto WHERE NOME = ? AND ID <> ?`,[nome,id]);
        return rows[0].Existe > 0;
    }

    static async ExisteCodigoBarras(codigoBarras,id=null){
        if(!id){
            const [rows] =  await db.query(`SELECT COUNT(*) AS Existe FROM produto WHERE CodigoBarras = ?`,[codigoBarras])
            return rows[0].Existe > 0;
        }
        const [rows] =  await db.query(`SELECT COUNT(*) AS Existe FROM produto WHERE CodigoBarras = ? AND ID <> ?`,[codigoBarras,id]);
        return rows[0].Existe > 0;
    }



}

export default Produto;