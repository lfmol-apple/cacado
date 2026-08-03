import db from "../config/dbConnect.js"
import Fornecedor from "./fornecedor.js"
import Tipo_Documento from "./tipo_documento.js"
import Forma_Pagamento from "./forma_pagamento.js";
import Compra_Item from "./compra_item.js"; 

class Compra{
    constructor(dados){
        //ID, Data, IDFornecedor, IDTipo_Documento, NumDocumento, DataVencimento, DataPagamento, IDFormaPagamento, ValorPago, Obs, DtCadastro, IDUsuCadastro       
        this.ID = dados?.ID;
        this.Data = dados?.Data;
        this.IDFornecedor = dados?.IDFornecedor;
        this.IDTipo_Documento =  dados?.IDTipo_Documento;
        this.NumDocumento  = dados?.NumDocumento;
        this.DataVencimento =  dados?.DataVencimento;
        this.DataPagamento  = dados?.DataPagamento;
        this.IDFormaPagamento  = dados?.IDFormaPagamento;
        this.ValorPago  = dados?.ValorPago;
        this.Obs = dados?.Obs;
        this.DtCadastro  = new Date();
        this.IDUsuCadastro = dados?.IDUsuCadastro;
        this.Itens = dados?.Itens? dados.Itens:[];
    }

    static async getAll(){
        const[rows] = await db.query(`SELECT 
                                        compra.*,
                                        fornecedor.Nome as NomeFornecedor,
                                        tipo_documento.Nome as NomeTipoDocumento,
                                        forma_pagamento.Nome as NomeFormaPagamento,
                                        usuario.Nome as NomeUsuCadastro
                                    FROM compra 
                                    INNER JOIN fornecedor ON fornecedor.ID = compra.IDfornecedor
                                    INNER JOIN tipo_documento ON tipo_documento.ID = compra.IDtipo_documento
                                    INNER JOIN forma_pagamento ON forma_pagamento.ID = compra.IDFORMAPAGAMENTO
                                    INNER JOIN usuario ON usuario.ID = compra.IDUSUCADASTRO
                                    ORDER BY compra.DATA, fornecedor.NOME`);
        return rows;
    }

    static async Get(id){
        const[rows] = await db.query(`SELECT 
                                        compra.*,
                                        fornecedor.Nome as NomeFornecedor,
                                        tipo_documento.Nome as NomeTipoDocumento,
                                        forma_pagamento.Nome as NomeFormaPagamento,
                                        usuario.Nome as NomeUsuCadastro
                                    FROM compra 
                                    LEFT JOIN fornecedor ON fornecedor.ID = compra.IDfornecedor
                                    LEFT JOIN tipo_documento ON tipo_documento.ID = compra.IDtipo_documento
                                    LEFT JOIN forma_pagamento ON forma_pagamento.ID = compra.IDFORMAPAGAMENTO
                                    LEFT JOIN usuario ON usuario.ID = compra.IDUSUCADASTRO
                                    WHERE compra.ID = ?
                                    ORDER BY compra.DATA, fornecedor.NOME`,[id]);
        
        let dados = rows[0];
        if(dados?.ID){
            dados.Fornecedor = await Fornecedor.Get(dados.IDFornecedor);
            dados.Tipo_Documento =  await Tipo_Documento.Get(dados.IDTipo_Documento);
            dados.Forma_Pagamento = await Forma_Pagamento.Get(dados.IDFormaPagamento);
            dados.Itens = await Compra_Item.getByCompra(dados.ID) ;
        }
        return dados;

    }
    
    static #formataFiltos(filtros){
        let params = [];
        let filtro = ' DATE(DATA) >= DATE(?) AND DATE(DATA) <= DATE(?)';
        params.push(filtros.PeriodoDe);
        params.push(filtros.PeriodoAte);
        if(filtros.IDFornecedor){
            filtro += ' AND compra.IDfornecedor = ?'
            params.push(filtros.IDFornecedor);
        }
        if(filtros.IDTipo_Documento){
            filtro += ' AND compra.IDTipo_Documento = ?';
            params.push(filtros.IDTipo_Documento);
        }
        if(filtros.NumDocumento){
            filtro += ' AND compra.NumDocumento = ?';
            params.push(filtros.NumDocumento);
        }
        if(filtros.PeriodoDeVencimento){
            filtro += ' AND DATE(compra.DataVencimento) >= DATE(?)';
            params.push(filtros.PeriodoDeVencimento);
        }
        if(filtros.PeriodoAteVencimento){
            filtro += ' AND DATE(compra.DataVencimento) <= DATE(?)';
            params.push(filtros.PeriodoAteVencimento);
        }
        if(filtros.PeriodoDePagamento){
            filtro += ' AND DATE(compra.DataPagamento) >= DATE(?)';
            params.push(filtros.PeriodoDePagamento);
        }
        if(filtros.PeriodoAtePagamento){
            filtro += ' AND DATE(compra.DataPagamento) <= DATE(?)';
            params.push(filtros.PeriodoAtePagamento);
        }
        if(filtros.StatusPagamento){
            if(filtros.StatusPagamento === 'pago'){ filtro += ' AND DataPagamento IS NOT NULL'}
            else { filtro += ' AND DataPagamento IS NULL'}
        }
        if(filtros.IDFormaPagamento){
            filtro += ' AND compra.IDFormaPagamento = ?';
            params.push(filtros.IDFormaPagamento);
        }
        if(filtros.IDUsuCadastro){
            filtro += ' AND compra.IDUsuCadastro = ?';
            params.push(filtros.IDUsuCadastro);
        }
        return {
            filtro,
            params
        };
    }

    static async GetByFiltros(filtros){
        const dados= this.#formataFiltos(filtros);
        let filtro = dados.filtro;
        let params = dados.params;
        let[rows] = await db.query(`SELECT 
                                        compra.*,
                                        fornecedor.Nome as NomeFornecedor,
                                        tipo_documento.Nome as NomeTipoDocumento,
                                        forma_pagamento.Nome as NomeFormaPagamento,
                                        usuario.Nome as NomeUsuCadastro
                                    FROM compra 
                                    LEFT JOIN fornecedor ON fornecedor.ID = compra.IDfornecedor
                                    LEFT JOIN tipo_documento ON tipo_documento.ID = compra.IDtipo_documento
                                    LEFT JOIN forma_pagamento ON forma_pagamento.ID = compra.IDFORMAPAGAMENTO
                                    LEFT JOIN usuario ON usuario.ID = compra.IDUSUCADASTRO
                                    WHERE ${filtro}
                                    ORDER BY compra.DATA, fornecedor.NOME`,params);
        let Compras = rows;
        [rows] = await db.query(`SELECT 
                                Sum( compra.ValorPago) As Total
                                FROM compra 
                                LEFT JOIN fornecedor ON fornecedor.ID = compra.IDfornecedor
                                LEFT JOIN tipo_documento ON tipo_documento.ID = compra.IDtipo_documento
                                LEFT JOIN forma_pagamento ON forma_pagamento.ID = compra.IDFORMAPAGAMENTO
                                LEFT JOIN usuario ON usuario.ID = compra.IDUSUCADASTRO
                                WHERE ${filtro}
                                ORDER BY compra.DATA, fornecedor.NOME`,params);
        let Total = 0;                                                                         
        if(rows.length > 0){
            Total = rows[0].Total;
        }                                
        return {Compras,Total};

    }

    async Insert(){
        const values = [
            this.Data,
            this.IDFornecedor,
            this.IDTipo_Documento,
            this.NumDocumento,
            this.DataVencimento,
            this.DataPagamento,
            this.IDFormaPagamento,
            this.ValorPago,
            this.Obs,
            this.DtCadastro,
            this.IDUsuCadastro
        ];

        const[rows] = await db.query(`INSERT INTO compra 
                                        (Data, IDFornecedor, IDTipo_Documento, NumDocumento, DataVencimento, DataPagamento, IDFormaPagamento, ValorPago, Obs, DtCadastro, IDUsuCadastro)
                                        VALUES
                                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,values);

        this.Itens.forEach(async item => {
            item.IDCompra = rows.insertId
            await new Compra_Item(item).Insert();
        });

        return Compra.Get(rows.insertId);

    }

    async Update(){
        const values = [
            this.Data,
            this.IDFornecedor,
            this.IDTipo_Documento,
            this.NumDocumento,
            this.DataVencimento,
            this.DataPagamento,
            this.IDFormaPagamento,
            this.ValorPago,
            this.Obs,
            this.DtCadastro,
            this.IDUsuCadastro,
            this.ID
        ];        
        const[rows] = await db.query(`UPDATE compra 
        SET
            Data = ?,
            IDFornecedor = ?,
            IDTipo_Documento = ?,
            NumDocumento = ?,
            DataVencimento = ?,
            DataPagamento = ?,
            IDFormaPagamento = ?,
            ValorPago = ?,
            Obs = ?,
            DtCadastro = ?,
            IDUsuCadastro = ?
        WHERE 
            ID = ?`,values);
        
        Compra_Item.DeleteByCompra(this.ID);
        
        this.Itens.forEach(item =>{
            item.IDCompra = this.ID;
            new Compra_Item(item).Insert();
        })
        return Compra.Get(rows.insertId);
       
    }
    static async Delete(id){
        const[rows] = await db.query(`DELETE FROM compra WHERE ID = ?`, [id]);
        return rows;

    }

}

export default Compra;