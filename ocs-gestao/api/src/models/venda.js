import db from "../config/dbConnect.js"
import Cliente from "./cliente.js";
import Tipo_Documento from "./tipo_documento.js"
import Forma_Pagamento from "./forma_pagamento.js";
import Venda_Item from "./venda_item.js";

class Venda{
    constructor(dados){
        //ID, Data, IDCliente, IDTipo_Documento, NumDocumento, DataVencimento, DataPagamento, TipoDesconto, Desconto, ValorPago, Obs, DtCadastro, IDUsuCadastro
        this.ID = dados?.ID;
        this.Data = dados?.Data? dados?.Data: new Date();
        this.IDCliente = dados?.IDCliente;
        this.IDTipo_Documento =  dados?.IDTipo_Documento;
        this.NumDocumento  = dados?.NumDocumento;
        this.DataVencimento =  dados?.DataVencimento;
        this.DataPagamento  = dados?.DataPagamento?.length>1? dados?.DataPagamento: null ;
        this.IDForma_Pagamento  = dados?.IDForma_Pagamento;
        this.TipoDesconto = dados?.TipoDesconto;
        this.Desconto = dados?.Desconto;
        this.ValorPago  = dados?.ValorPago;
        this.Obs = dados?.Obs;
        this.DtCadastro  = new Date();
        this.IDUsuCadastro = dados?.IDUsuCadastro;
        this.Itens = dados?.Itens? dados.Itens:[];
    }

    static async getAll(){
        const[rows] = await db.query(`SELECT 
                                        venda.*,
                                        cliente.Nome as NomeCliente,
                                        tipo_documento.Nome as NomeTipoDocumento,
                                        forma_pagamento.Nome as NomeFormaPagamento,
                                        usuario.Nome as NomeUsuCadastro
                                    FROM venda 
                                    INNER JOIN cliente ON cliente.ID = venda.IDcliente
                                    INNER JOIN tipo_documento ON tipo_documento.ID = venda.IDtipo_documento
                                    INNER JOIN forma_pagamento ON forma_pagamento.ID = venda.IDforma_pagamento
                                    INNER JOIN usuario ON usuario.ID = venda.IDUSUCADASTRO
                                    ORDER BY venda.DATA, cliente.NOME`);
        return rows;
    }

    static async Get(id){
        const[rows] = await db.query(`SELECT 
                                        venda.*,
                                        cliente.Nome as NomeCliente,
                                        tipo_documento.Nome as NomeTipoDocumento,
                                        forma_pagamento.Nome as NomeFormaPagamento,
                                        usuario.Nome as NomeUsuCadastro
                                    FROM venda 
                                    INNER JOIN cliente ON cliente.ID = venda.IDcliente
                                    LEFT JOIN tipo_documento ON tipo_documento.ID = venda.IDtipo_documento
                                    LEFT JOIN forma_pagamento ON forma_pagamento.ID = venda.IDforma_pagamento
                                    LEFT JOIN usuario ON usuario.ID = venda.IDUSUCADASTRO
                                    WHERE venda.ID = ?
                                    ORDER BY venda.DATA, cliente.NOME`,[id]);
        
        let dados = rows[0];
        if(dados?.ID){
            dados.Cliente = await Cliente.Get(dados.IDCliente);
            dados.Tipo_Documento = await Tipo_Documento.Get(dados.IDTipo_Documento);
            dados.Forma_Pagamento =  await Forma_Pagamento.Get(dados.IDFormaPagamento);
            dados.Itens = await Venda_Item.getByVenda(dados.ID) ;
        }
        return dados;

    }
    
    static #formataFiltos(filtros){
        let params = [];
        let filtro = ' DATE(DATA) >= DATE(?) AND DATE(DATA) <= DATE(?)';
        params.push(filtros.PeriodoDe);
        params.push(filtros.PeriodoAte);
        if(filtros.IDCliente){
            filtro += ' AND venda.IDcliente = ?'
            params.push(filtros.IDCliente);
        }
        if(filtros.IDTipo_Documento){
            filtro += ' AND venda.IDTipo_Documento = ?';
            params.push(filtros.IDTipo_Documento);
        }
        if(filtros.NumDocumento){
            filtro += ' AND venda.NumDocumento = ?';
            params.push(filtros.NumDocumento);
        }
        if(filtros.PeriodoDeVencimento){
            filtro += ' AND DATE(venda.DataVencimento) >= DATE(?)';
            params.push(filtros.PeriodoDeVencimento);
        }
        if(filtros.PeriodoAteVencimento){
            filtro += ' AND DATE(venda.DataVencimento) <= DATE(?)';
            params.push(filtros.PeriodoAteVencimento);
        }
        if(filtros.PeriodoDePagamento){
            filtro += ' AND DATE(venda.DataPagamento) >= DATE(?)';
            params.push(filtros.PeriodoDePagamento);
        }
        if(filtros.PeriodoAtePagamento){
            filtro += ' AND DATE(venda.DataPagamento) <= DATE(?)';
            params.push(filtros.PeriodoAtePagamento);
        }
        if(filtros.StatusPagamento){
            if(filtros.StatusPagamento === 'pago'){ filtro += ' AND DataPagamento IS NOT NULL'}
            else { filtro += ' AND DataPagamento IS NULL'}
        }
        if(filtros.IDFormaPagamento){
            filtro += ' AND venda.IDForma_Pagamento = ?';
            params.push(filtros.IDFormaPagamento);
        }
        if(filtros.IDUsuCadastro){
            filtro += ' AND venda.IDUsuCadastro = ?';
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
        let [rows] = await db.query(`SELECT 
                                        venda.*,
                                        cliente.Nome as NomeCliente,
                                        tipo_documento.Nome as NomeTipoDocumento,
                                        forma_pagamento.Nome as NomeFormaPagamento,
                                        usuario.Nome as NomeUsuCadastro
                                    FROM venda 
                                    LEFT JOIN cliente ON cliente.ID = venda.IDcliente
                                    LEFT JOIN tipo_documento ON tipo_documento.ID = venda.IDtipo_documento
                                    LEFT JOIN forma_pagamento ON forma_pagamento.ID = venda.IDforma_pagamento
                                    LEFT JOIN usuario ON usuario.ID = venda.IDUSUCADASTRO
                                    WHERE ${filtro}
                                    ORDER BY venda.DATA, cliente.NOME`,params);
        let Vendas = rows;
        [rows] = await db.query(`SELECT 
                                    Sum( venda.ValorPago) As Total
                                    FROM venda 
                                    LEFT JOIN cliente ON cliente.ID = venda.IDcliente
                                    LEFT JOIN tipo_documento ON tipo_documento.ID = venda.IDtipo_documento
                                    LEFT JOIN forma_pagamento ON forma_pagamento.ID = venda.IDforma_pagamento
                                    LEFT JOIN usuario ON usuario.ID = venda.IDUSUCADASTRO
                                    WHERE ${filtro}
                                    ORDER BY venda.DATA, cliente.NOME`,params);       
        let Total = 0;                                                                         
        if(rows.length > 0){
            Total = rows[0].Total;
        }
        return {Vendas,Total};

    }

    async Insert(){
        //ID, Data, IDCliente, IDTipo_Documento, NumDocumento, DataVencimento, DataPagamento, TipoDesconto, Desconto, ValorPago, Obs, DtCadastro, IDUsuCadastro

        const values = [
            this.Data,
            this.IDCliente,
            this.IDTipo_Documento,
            this.NumDocumento,
            this.DataVencimento,
            this.DataPagamento,
            this.TipoDesconto,
            this.Desconto,
            this.IDFormaPagamento,
            this.ValorPago,
            this.Obs,
            this.DtCadastro,
            this.IDUsuCadastro
        ];

        const[rows] = await db.query(`INSERT INTO venda 
                                        (
                                            Data, 
                                            IDCliente, 
                                            IDTipo_Documento, 
                                            NumDocumento, 
                                            DataVencimento, 
                                            DataPagamento, 
                                            TipoDesconto, 
                                            Desconto, 
                                            IDForma_Pagamento,
                                            ValorPago, 
                                            Obs, 
                                            DtCadastro, 
                                            IDUsuCadastro
                                        )
                                        VALUES
                                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`,values);

        this.Itens.forEach(async item => {
            item.IDVenda = rows.insertId;
            await new Venda_Item(item).Insert();
        });

        return Venda.Get(rows.insertId);

    }

    async Update(){
        const values = [
            this.Data,
            this.IDCliente,
            this.IDTipo_Documento,
            this.NumDocumento,
            this.DataVencimento,
            this.DataPagamento,
            this.TipoDesconto,
            this.Desconto,
            this.IDFormaPagamento,
            this.ValorPago,
            this.Obs,
            this.DtCadastro,
            this.IDUsuCadastro,
            this.ID
        ];        
        const[rows] = await db.query(`UPDATE venda 
        SET
            Data = ?,
            IDCliente = ?,
            IDTipo_Documento = ?,
            NumDocumento = ?,
            DataVencimento = ?,
            DataPagamento = ?,
            TipoDesconto = ?,
            Desconto = ?,
            IDForma_Pagamento = ?,
            ValorPago = ?,
            Obs = ?,
            DtCadastro = ?,
            IDUsuCadastro = ?
        WHERE 
            ID = ?`,values);
        
        await Venda_Item.DeleteByVenda(this.ID)

        this.Itens.forEach(async item =>{
            item.IDVenda = this.ID;
           await new Venda_Item(item).Insert();
        })
        return Venda.Get(rows.insertId);
       
    }
    static async Delete(id){
        const[rows] = await db.query(`DELETE FROM venda WHERE ID = ?`, [id]);
        return rows;

    }

}

export default Venda;