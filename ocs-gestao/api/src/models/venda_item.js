import db from "../config/dbConnect.js";
import Produto from "./produto.js";
import Unidade_Medida from "./unidade_medida.js";

class Venda_Item{
    constructor(dados){
        //ID, IDVenda, IDProduto, Quantidade, ValorUnitario
        this.ID = dados?.ID;
        this.IDVenda = dados?.IDVenda;
        this.IDProduto = dados?.IDProduto;
        this.Quantidade = dados?.Quantidade;
        this.ValorUnitario = dados?.ValorUnitario;
    }

    static async getByVenda(idVenda){
        const [rows] = await db.query(`SELECT 
                                            venda_item.*,
                                            (ROUND(venda_item.Quantidade * venda_item.ValorUnitario,2)) AS ValorTotal,
                                            produto.NOME AS NomeProduto,
                                            unidade_medida.Nome as NomeUnidadeMedida,
                                            unidade_medida.Sigla as SiglaUnidadeMedida
                                        FROM venda_item
                                        INNER JOIN produto ON produto.ID = venda_item.IDproduto
                                        INNER JOIN unidade_medida ON unidade_medida.ID = produto.IDunidade_medida
                                        WHERE venda_item.IDVENDA = ?
                                        ORDER BY produto.NOME`, [idVenda]);
        return rows;
    } 

    static async Get(id){
        const [rows] = await db.query(`SELECT 
                                            venda_item.*,
                                            (venda_item.Quantidade * venda_item.ValorUnitario) AS ValorTotal,
                                            produto.NOME AS NomeProduto,
                                            unidade_medida.Nome as NomeUnidadeMedida,
                                            unidade_medida.Sigla as SiglaUnidadeMedida
                                        FROM venda_item
                                        INNER JOIN produto ON produto.ID = venda_item.IDproduto
                                        INNER JOIN unidade_medida ON unidade_medida.ID = produto.IDunidade_medida
                                        WHERE venda_item.ID = ?`, [id]);        
        let dados = rows[0];
        if(dados?.ID){
            dados.Produto = Produto.Get(dados.IDProduto);
            dados.Unidade_Medida = Unidade_Medida.Get(dados.Produto.IDUnidade_Medida);
        }
        return dados;
    }

    async Insert(){
        const values= [this.IDVenda,this.IDProduto, this.Quantidade,this.ValorUnitario];
        const[rows] = await db.query(`INSERT INTO venda_item
                                        (IDVenda, IDProduto, Quantidade, ValorUnitario)
                                        VALUES
                                        (?, ?, ?, ?)`,values);
        return Venda_Item.Get(rows.insertId);
    }

    async Update(){
        const values = [this.IDVenda,this.IDProduto, this.Quantidade,this.ValorUnitario,this.ID];
        const [rows] = await db.query(`UPDATE venda_item SET
                                            IDVenda = ?,
                                            IDProduto = ?,
                                            Quantidade = ?,
                                            ValorUnitario = ?
                                            WHERE ID = ?`)
        return Venda_Item.Get(this.ID);
    }

    static async Delete(id){
        await db.execute(`DELETE FROM venda_item WHERE ID=?`,[id]);
    }

    static async DeleteByVenda(IDVenda){
        await db.execute(`DELETE FROM venda_item WHERE IDVENDA=?`,[IDVenda]);
    }
}

export default Venda_Item;