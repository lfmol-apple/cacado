import db from "../config/dbConnect.js";
import Usuario from "./usuario.js";

class Fornecedor{

    constructor(dados){
        //ID, TipoPessoa, NumDoc, Nome, RazaoSocial, InscEstadual, CEP, Endereco, Complemento, Bairro, Cidade, UF, Telefone, Celular, Whatsapp, Email, NomeContato, Obs, DtCadastro, IDUsuCadastro, Ativo
        this.ID             = dados?.ID;
        this.TipoPessoa     = dados?.TipoPessoa == 1? true:false;
        this.NumDoc         = dados?.NumDoc;
        this.Nome           = dados?.Nome;
        this.RazaoSocial    = dados?.RazaoSocial;
        this.InscEstadual   = dados?.InscEstadual;
        this.CEP            = dados?.CEP;
        this.Endereco       = dados?.Endereco;
        this.Complemento    = dados?.Complemento;
        this.Bairro         = dados?.Bairro;
        this.Cidade         = dados?.Cidade;
        this.UF             = dados?.UF;
        this.Telefone       = dados?.Telefone;
        this.Celular        = dados?.Celular;
        this.Whatsapp       = dados?.Whatsapp?1:0;
        this.Email          = dados?.Email;
        this.NomeContato    = dados?.NomeContato;
        this.Obs            = dados?.Obs;
        this.DtCadastro     =  new Date();
        this.IDUsuCadastro  = dados?.IDUsuCadastro;
        this.Ativo          = dados?.Ativo? 1:0;
    }

    static async GetAll(){
        const [rows] = await db.query(`SELECT fornecedor.*,usuario.Nome as NomeUsuCadastro
                                    FROM fornecedor
                                    INNER JOIN usuario ON usuario.ID = fornecedor.IDUsuCadastro
                                    ORDER BY fornecedor.Nome`);
                               
        return rows;
    }
    static async GetAtivos(){
        const [rows] = await  db.query(`SELECT fornecedor.*,usuario.Nome as NomeUsuCadastro
                                    FROM fornecedor
                                    INNER JOIN usuario ON usuario.ID = fornecedor.IDUsuCadastro
                                    WHERE fornecedor.ATIVO = 1
                                    ORDER BY fornecedor.Nome`);
        return rows;
    }
    static async Get(id){
          let [rows] = await db.query(`SELECT fornecedor.*,usuario.Nome as NomeUsuCadastro
                                    FROM fornecedor
                                    INNER JOIN usuario ON usuario.ID = fornecedor.IDUsuCadastro
                                    WHERE fornecedor.ID = ?
                                    ORDER BY fornecedor.Nome`, [id]);
        if(rows[0]?.ID > 0){
            rows[0].UsuCadastro = await Usuario.Get(rows[0].IDUsuCadastro);
        }

        return rows[0];

    }

    async Insert(){
        const values = [
            this.TipoPessoa, 
            this.NumDoc, 
            this.Nome, 
            this.RazaoSocial, 
            this.InscEstadual, 
            this.CEP, 
            this.Endereco, 
            this.Complemento, 
            this.Bairro, 
            this.Cidade, 
            this.UF, 
            this.Telefone, 
            this.Celular, 
            this.Whatsapp, 
            this.Email, 
            this.NomeContato, 
            this.Obs, 
            this.DtCadastro, 
            this.IDUsuCadastro, 
            this.Ativo]
        const [rows] = await  db.query(`INSERT INTO fornecedor
                                (TipoPessoa, NumDoc, Nome, RazaoSocial, InscEstadual, CEP, Endereco, Complemento, 
                                    Bairro, Cidade, UF, Telefone, Celular, Whatsapp, Email, NomeContato, Obs, DtCadastro, IDUsuCadastro, Ativo)
                                VALUES
                                (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,values);

        return await Fornecedor.Get(rows.insertId);
    }

    async Update(){
        const values = [
            this.TipoPessoa, 
            this.NumDoc, 
            this.Nome, 
            this.RazaoSocial, 
            this.InscEstadual, 
            this.CEP, 
            this.Endereco, 
            this.Complemento, 
            this.Bairro, 
            this.Cidade, 
            this.UF, 
            this.Telefone, 
            this.Celular, 
            this.Whatsapp, 
            this.Email, 
            this.NomeContato, 
            this.Obs, 
            this.DtCadastro, 
            this.IDUsuCadastro, 
            this.Ativo,
            this.ID] 
        
        const [rows]  = await  db.query(`UPDATE fornecedor
                                    SET
                                        TipoPessoa = ?,
                                        NumDoc = ?,
                                        Nome = ?,
                                        RazaoSocial = ?,
                                        InscEstadual = ?,
                                        CEP = ?,
                                        Endereco = ?,
                                        Complemento = ?,
                                        Bairro = ?,
                                        Cidade = ?,
                                        UF = ?,
                                        Telefone = ?,
                                        Celular = ?,
                                        Whatsapp = ?,
                                        Email = ?,
                                        NomeContato = ?,
                                        Obs = ?,
                                        DtCadastro = ?,
                                        IDUsuCadastro = ?,
                                        Ativo = ?
                                    WHERE ID = ?`,values);
        var dados = await Fornecedor.Get(this.ID);            
        return  dados;

    }

    static async VerificaNome(Nome,ID=null){
        if(!ID){
            const [rows] = await  db.query(`SELECT COUNT(*) AS ExisteNome FROM fornecedor WHERE NOME = ?`,[Nome]);
            
            return rows[0].ExisteNome > 0;
        }
        const [rows] = await db.query(`SELECT COUNT(*) AS ExisteNome FROM fornecedor WHERE NOME = ? AND ID <> ?`,[Nome,ID]);

        return rows[0].ExisteNome > 0;
    }
    static async VerificaRazaoSocial(RazaoSocial,ID=null){
        if(RazaoSocial.lenght > 2){
            if(!(ID>0)){
                const [rows] = await  db.query(`SELECT COUNT(*) AS Existe FROM fornecedor WHERE RazaoSocial = ?`,[RazaoSocial]);
                return rows[0].Existe > 0;
            }
            const [rows] = await  db.query(`SELECT COUNT(*) AS Existe FROM fornecedor WHERE RazaoSocial = ? AND ID <> ?`,[RazaoSocial,ID]);
            return rows[0].Existe > 0;
        }
        else return false;
    }

    static async GetAutoComplete(dados){
        const values = [`%${dados}%`,`%${dados}%`];
        const [rows] = await db.query(`SELECT 
                                            fornecedor.*
                                        FROM fornecedor
                                        WHERE (fornecedor.NOME LIKE ? OR fornecedor.RazaoSocial LIKE ?)
                                        AND ATIVO = b'1'
                                        ORDER BY fornecedor.NOME 
                                        LIMIT 10`,values);
        return rows;
    }    
}

export default Fornecedor;