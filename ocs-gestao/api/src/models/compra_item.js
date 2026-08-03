import db from "../config/dbConnect.js";
import Insumo from "./insumo.js";
import Unidade_Medida from "./unidade_medida.js";

class Compra_Item{
    constructor(dados){
        //ID, IDCompra, IDInsumo, Quantidade, ValorUnitario
        this.ID = dados?.ID;
        this.IDCompra = dados?.IDCompra;
        this.IDInsumo = dados?.IDInsumo;
        this.Quantidade = dados?.Quantidade;
        this.ValorUnitario = dados?.ValorUnitario;
    }

    static async getByCompra(idCompra){
        const [rows] = await db.query(`SELECT 
                                            compra_item.*,
                                            (compra_item.Quantidade * compra_item.ValorUnitario) AS ValorTotal,
                                            insumo.NOME AS NomeInsumo,
                                            UNIDADE_MEDIDA.Nome as NomeUnidadeMedida,
                                            UNIDADE_MEDIDA.Sigla as SiglaUnidadeMedida
                                        FROM compra_item
                                        INNER JOIN insumo ON insumo.ID = compra_item.IDinsumo
                                        INNER JOIN UNIDADE_MEDIDA ON UNIDADE_MEDIDA.ID = insumo.IDUNIDADE_MEDIDA
                                        WHERE compra_item.IDCOMPRA = ?
                                        ORDER BY insumo.NOME`, [idCompra]);
        return rows;
    } 

    static async Get(id){
        const [rows] = await db.query(`SELECT 
                                            compra_item.*,
                                            (compra_item.Quantidade * compra_item.ValorUnitario) AS ValorTotal,
                                            insumo.NOME AS NomeInsumo,
                                            UNIDADE_MEDIDA.Nome as NomeUnidadeMedida,
                                            UNIDADE_MEDIDA.Sigla as SiglaUnidadeMedida
                                        FROM compra_item
                                        INNER JOIN insumo ON insumo.ID = compra_item.IDinsumo
                                        INNER JOIN UNIDADE_MEDIDA ON UNIDADE_MEDIDA.ID = insumo.IDUNIDADE_MEDIDA
                                        WHERE compra_item.ID = ?`, [id]);        
        let dados = rows[0];
        if(dados?.ID){
            dados.Insumo = Insumo.Get(dados.IDInsumo);
            dados.Unidade_Medida = Unidade_Medida.Get(dados.Insumo.IDUnidade_Medida);
        }
        return dados;
    }

    async Insert(){
        const values= [this.IDCompra,this.IDInsumo, this.Quantidade,this.ValorUnitario];
        const[rows] = await db.query(`INSERT INTO compra_item
                                        (IDCompra, IDInsumo, Quantidade, ValorUnitario)
                                        VALUES
                                        (?, ?, ?, ?)`,values);
        return Compra_Item.Get(rows.insertId);
    }

    async Update(){
        const values = [this.IDCompra,this.IDInsumo, this.Quantidade,this.ValorUnitario,this.ID];
        const [rows] = await db.query(`UPDATE compra_item SET
                                            IDCompra = ?,
                                            IDInsumo = ?,
                                            Quantidade = ?,
                                            ValorUnitario = ?
                                            WHERE ID = ?`)
        return Compra_Item.Get(this.ID);
    }

    static async Delete(id){
        await db.execute(`DELETE FROM compra_item WHERE ID=?`,[id]);
    }

    static async DeleteByCompra(IDCompra){
        await db.execute(`DELETE FROM compra_item WHERE IDCompra=?`,[IDCompra]);
    }
}

export default Compra_Item;