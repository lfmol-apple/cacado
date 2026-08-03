// galpao_movimentacao.js
import db from '../config/dbConnect.js';

class galpao_movimentacao {
  constructor(dados = {}) {
    this.ID = dados.ID ?? null;
    this.IDGalpao = dados.IDGalpao ?? null;
    this.Data = dados.Data ?? null;
    this.QtdOvos = dados.QtdOvos ?? 0;
    this.QtdRacao = dados.QtdRacao ?? 0;
    this.QtdMortes = dados.QtdMortes ?? 0;
    this.IDUsuCadastro = dados.IDUsuCadastro ?? null;
    this.DtCadastro = dados.DtCadastro ?? new Date();
  }

  // Recuperar movimentação por ID
  static async Get(ID) {
    const [rows] = await db.query('SELECT * FROM galpao_movimentacao WHERE ID = ?', [ID]);
    if (rows.length === 0) {
      throw new Error(`Movimentação com ID ${ID} não encontrada`);
    }
    return new galpao_movimentacao(rows[0]);
  }

  // Recuperar movimentações por ID do Galpão
  static async GetByGalpao(IDGalpao) {
    const [rows] = await db.query('SELECT * FROM galpao_movimentacao WHERE IDGalpao = ?', [IDGalpao]);
    return rows.map(row => new galpao_movimentacao(row));
  }

  // Recuperar movimentações por Data
  static async GetByData(Data) {
    const [rows] = await db.query('SELECT * FROM galpao_movimentacao WHERE Data = ?', [Data]);
    return rows.map(row => new galpao_movimentacao(row));
  }

  static #fomataFiltros(filtros){
    let params = [];
    let filtro = ' DATE(DATA) >= DATE(?) AND DATE(DATA) <= DATE(?)';
    params.push(filtros.PeriodoDe);
    params.push(filtros.PeriodoAte);

    if(filtros.Galpao > 0){
      filtro += ' AND IDGalpao = ?';
      params.push(filtros.Galpao);
    }

    return {
      filtro,
      params
    }
  }

  static async GetByFiltros(Filtros){
    const dadosFiltros = this.#fomataFiltros(Filtros);
    let filtro = dadosFiltros.filtro;
    let params = dadosFiltros.params;
    let [rows] = await db.query(`SELECT 
                                  galpao_movimentacao.*, galpao.Nome Galpao
                                FROM galpao_movimentacao
                                INNER JOIN galpao on galpao.id = galpao_movimentacao.IDGalpao
                                INNER JOIN usuario on usuario.id = galpao_movimentacao.IDUsuCadastro
                                WHERE ${filtro}
                                ORDER BY galpao_movimentacao.Data;`, params);

      const movimentacoes = rows;
      const totais =  await   this.GetTotaisByFiltros(Filtros);
    return {
      movimentacoes,
      totais
    } ;
  }


  static async GetTotaisByFiltros(Filtros){
    const dados = this.#fomataFiltros(Filtros);
    let filtro = dados.filtro;
    let params = dados.params;
    let [rows] = await db.query(`SELECT
                                  SUM(QtdOvos) TotalOvos,
                                    SUM(QtdRacao) TotalRacao,
                                    SUM(QtdMortes) TotalMortes
                                FROM galpao_movimentacao
                                INNER JOIN galpao on galpao.id = galpao_movimentacao.IDGalpao
                                INNER JOIN usuario on usuario.id = galpao_movimentacao.IDUsuCadastro
                                WHERE ${filtro}
                                ORDER BY galpao_movimentacao.Data;`, params);
                            return rows[0];
  }

  // Inserir uma nova movimentação
  async Insert() {
    const [result] = await db.execute(
      `INSERT INTO galpao_movimentacao (IDGalpao, Data, QtdOvos, QtdRacao, QtdMortes, IDUsuCadastro, DtCadastro) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [this.IDGalpao, this.Data, this.QtdOvos, this.QtdRacao, this.QtdMortes, this.IDUsuCadastro, this.DtCadastro]
    );
    this.ID = result.insertId;
    return this;
  }

  // Atualizar uma movimentação existente
  async Update() {
    const [result] = await db.execute(
      `UPDATE galpao_movimentacao SET IDGalpao = ?, Data = ?, QtdOvos = ?, QtdRacao = ?, QtdMortes = ?, 
       IDUsuCadastro = ?, DtCadastro = ? WHERE ID = ?`,
      [this.IDGalpao, this.Data, this.QtdOvos, this.QtdRacao, this.QtdMortes, this.IDUsuCadastro, this.DtCadastro, this.ID]
    );
    if (result.affectedRows === 0) {
      throw new Error(`Movimentação com ID ${this.ID} não encontrada`);
    }
    return this;
  }

  // Deletar uma movimentação
  static async Delete(ID) {
    const [result] = await db.execute('DELETE FROM galpao_movimentacao WHERE ID = ?', [ID]);
    if (result.affectedRows === 0) {
      throw new Error(`Movimentação com ID ${ID} não encontrada`);
    }
    return result.affectedRows > 0;
  }
}

export default galpao_movimentacao;
