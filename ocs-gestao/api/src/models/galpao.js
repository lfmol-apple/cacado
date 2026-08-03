// galpao.js
import db from '../config/dbConnect.js';

class galpao {
  constructor(dados = {}) {
    this.ID = dados.ID ?? null;
    this.Nome = dados.Nome ?? '';
    this.NumAves = dados.NumAves ?? 0;
    this.Ativo = dados.Ativo ?? true;
  }

  static async GetAll() {
    const [rows] = await db.query('SELECT * FROM galpao');
    return rows.map(row => new galpao(row));
  }

  static async Get(ID) {
    const [rows] = await db.query('SELECT * FROM galpao WHERE ID = ?', [ID]);
    if (rows.length === 0) {
      throw new Error(`galpao com ID ${ID} não encontrado`);
    }
    return new galpao(rows[0]);
  }

  static async GetAtivos() {
    const [rows] = await db.query('SELECT * FROM galpao WHERE Ativo = 1');
    return rows.map(row => new galpao(row));
  }

  async Insert() {
    const [result] = await db.execute(
      `INSERT INTO galpao (Nome, NumAves, Ativo) VALUES (?, ?, ?)`,
      [this.Nome, this.NumAves, this.Ativo]
    );
    this.ID = result.insertId;
    return this;
  }

  async Update() {
    const [result] = await db.execute(
      `UPDATE galpao SET Nome = ?, NumAves = ?, Ativo = ? WHERE ID = ?`,
      [this.Nome, this.NumAves, this.Ativo, this.ID]
    );
    if (result.affectedRows === 0) {
      throw new Error(`galpao com ID ${this.ID} não encontrado`);
    }
    return this;
  }

  static async Delete(ID) {
    const [result] = await db.execute('DELETE FROM galpao WHERE ID = ?', [ID]);
    if (result.affectedRows === 0) {
      throw new Error(`galpao com ID ${ID} não encontrado`);
    }
    return result.affectedRows > 0;
  }
}

export default galpao;
