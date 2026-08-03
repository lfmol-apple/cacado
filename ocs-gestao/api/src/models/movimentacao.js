import db from "../config/dbConnect.js";
import Tipo_Movimentacao from "./tipo_movimentacao.js"

class Movimentacao{
    constructor(dados){
        //ID, IDTipo_Movimentacao, IDUsuCadastro, DtCadastro, Valor, Observacoes, Conferido, IDUsuConferencia, , Excluido, DtExclusao, IDUsuExclusao
        this.ID = dados?.ID;
        this.IDTipo_Movimentacao = dados?.IDTipo_Movimentacao;
        this.IDUsuCadastro = dados?.IDUsuCadastro;
        this.DtCadastro = new Date();
        this.Valor = dados?.Valor;
        this.Observacoes = dados?.Observacoes;
        this.Conferido = dados?.Conferido? dados.Conferido: false;
        this.IDUsuConferencia = dados?.IDUsuConferencia;
        this.DtConferencia = dados?.DtConferencia
        this.Excluido = 0;
        this.DtExclusao = dados?.DtExclusao;
        this.IDUsuExclusao = dados?.IDUsuExclusao;
    }

    static #formataFiltos(filtros){
        let params = [];
        let filtro = ' DATE(DTCADASTRO) >= DATE(?) AND DATE(DTCADASTRO) <= DATE(?)';
        params.push(filtros.PeriodoDe);
        params.push(filtros.PeriodoAte);
        if(filtros.IDTipo_Movimentacao){
            filtro += ' AND movimentacao.IDTipo_Movimentacao = ?';
            params.push(filtros.IDTipo_Movimentacao);
        }
        if(filtros.Status === true || filtros.Status === false){
            filtro += ' AND movimentacao.Conferido = ?';
            params.push(filtros.Status);
        }
        if(filtros.IDUsuCadastro){
            filtro += ' AND movimentacao.IDUsuCadastro = ?';
            params.push(filtros.IDUsuCadastro);
        }
        return {
            filtro,
            params
        };
    }


    static async getByFiltros(filtros){
        const dadosFiltros = this.#formataFiltos(filtros);
        const filtro = dadosFiltros.filtro;
        const params = dadosFiltros.params;
        var [rows] = await db.query(`SELECT
                            movimentacao.*,
                            tipo_movimentacao.Nome as NomeTipoMovimentacao,
                            usucadastro.Nome as NomeUsuCadastro,
                            usuconferencia.Nome as NomeUsuConferencia,
                            usuexclusao.Nome as NomeUsuExclusao
                        FROM movimentacao
                        INNER JOIN tipo_movimentacao ON tipo_movimentacao.ID = movimentacao.IDtipo_movimentacao
                        INNER JOIN usuario usucadastro ON usucadastro.ID = movimentacao.IDusucadastro
                        LEFT JOIN usuario usuconferencia ON usuconferencia.ID = movimentacao.IDusuconferencia
                        LEFT JOIN usuario usuexclusao ON usuexclusao.ID = movimentacao.IDusuexclusao
                        WHERE ${filtro}
                        ORDER BY movimentacao.DTCADASTRO`,params)
        console.log(filtro);
        const Totais = await this.getTotaisByFiltros(filtros);
        return {
            Movimentacoes : rows,
            Totais
        }
    }

    static async getTotaisByFiltros(filtros){
        const dadosFiltros = this.#formataFiltos(filtros);
        const filtro = dadosFiltros.filtro;
        const params = dadosFiltros.params;
        var [rows] = await db.query(`SELECT
                                        CASE
                                        WHEN tipo_movimentacao.CREDITO THEN 'Credito'
                                        else 'Debito'
                                        END as Tipo,
                                        SUM(movimentacao.VALOR) as Total
                                    FROM movimentacao
                                    INNER JOIN tipo_movimentacao ON tipo_movimentacao.ID = movimentacao.IDtipo_movimentacao
                                    INNER JOIN usuario usucadastro ON usucadastro.ID = movimentacao.IDusucadastro
                                    LEFT JOIN usuario usuconferencia ON usuconferencia.ID = movimentacao.IDusuconferencia
                                    LEFT JOIN usuario usuexclusao ON usuexclusao.ID = movimentacao.IDusuexclusao
                                    WHERE ${filtro}
                                    GROUP BY tipo_movimentacao.Credito`,params);
        // if (rows.length > 0){
        //     let dados = rows[0];
        //   //  dados.Total = dados.Credito?dados.Credito:0 + dados.Debito?dados.Debito:0
        //     return dados;
        // }
        return rows;
        return null

    }

    static async Get(ID){
        var [rows] = await db.query(`SELECT
                                        movimentacao.*,
                                        tipo_movimentacao.Nome as NomeTipoMovimentacao,
                                        usucadastro.Nome as NomeUsuCadastro,
                                        usuconferencia.Nome as NomeUsuConferencia,
                                        usuexclusao.Nome as NomeUsuExclusao
                                    FROM movimentacao
                                    INNER JOIN tipo_movimentacao ON tipo_movimentacao.ID = movimentacao.IDtipo_movimentacao
                                    INNER JOIN usuario usucadastro ON usucadastro.ID = movimentacao.IDusucadastro
                                    LEFT JOIN usuario usuconferencia ON usuconferencia.ID = movimentacao.IDusuconferencia
                                    LEFT JOIN usuario usuexclusao ON usuexclusao.ID = movimentacao.IDusuexclusao
                                    WHERE movimentacao.ID = ?`,[ID])    
        return rows[0]
    }

    async Insert(){
        const [rows] = await db.query(`INSERT INTO movimentacao
        (IDTipo_Movimentacao, IDUsuCadastro, DtCadastro, Valor, Observacoes, Conferido, IDUsuConferencia, DtConferencia, Excluido, DtExclusao, IDUsuExclusao)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            this.IDTipo_Movimentacao,
            this.IDUsuCadastro,
            this.DtCadastro,
            this.Valor,
            this.Observacoes,
            this.Conferido,
            this.IDUsuConferencia,
            this.DtConferencia,
            this.Excluido,
            this.DtExclusao,
            this.IDUsuExclusao
        ])
        return Movimentacao.Get(rows.insertId);
    }

    async Update(){
        db.execute(`UPDATE movimentacao
                    SET
                        IDTipo_Movimentacao	= ?,
                        IDUsuCadastro	= ?,
                        DtCadastro	= ?,
                        Valor	= ?,
                        Observacoes	= ?,
                        IDUsuConferencia	= ?,
                        DtConferencia	= ?,
                        Excluido	= ?,
                        DtExclusao	= ?,
                        IDUsuExclusao = ?
                    WHERE ID = ?`,        [
                        this.IDTipo_Movimentacao,
                        this.IDUsuCadastro,
                        this.DtCadastro,
                        this.Valor,
                        this.Observacoes,
                        this.IDUsuConferencia,
                        this.DtConferencia,
                        this.Excluido,
                        this.DtExclusao,
                        this.IDUsuExclusao,
                        this.ID
                    ])  
        return Movimentacao.Get(this.ID);
    }

    static async toggleConferido(ID,IDUsuConferencia){
        await db.execute(`UPDATE 
        movimentacao 
        SET 
        CONFERIDO =( CASE
            WHEN CONFERIDO IS NULL THEN 0
            ELSE NOT CONFERIDO
        END  ),
        IDusuconferencia = CASE WHEN CONFERIDO THEN ? ELSE NULL END,
        DTCONFERENCIA = CASE WHEN CONFERIDO THEN NOW() ELSE NULL END
        WHERE ID = ?  `,[IDUsuConferencia,ID]);
        return;
    }

    static async Delete(ID,IDUsuExclusao){
        await db.execute(`UPDATE 
                            movimentacao 
                            SET 
                            EXCLUIDO =  1,
                            IDusuexclusao = ?,
                            DTEXCLUSAO = NOW()
                            WHERE ID = ?  `,[IDUsuExclusao,ID]);
        return;
    }
}

export default Movimentacao