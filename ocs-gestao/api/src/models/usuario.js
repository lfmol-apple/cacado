import db from "../config/dbConnect.js";
import getHash from "./hash.js";
import Grupo_Usuarios from "./grupo_usuarios.js";
import jwt from "jsonwebtoken"

class Usuario{
    constructor(dados){
        //ID, IDGrupo_Usuarios, Nome, Login, Senha, Ativo
        this.ID = dados?.ID;
        this.IDGrupo_Usuarios = dados?.IDGrupo_Usuarios;
        this.Nome = dados?.Nome;
        this.Login = dados?.Login;
        this.Senha = dados?.Senha;
        this.Ativo = dados?.Ativo? dados.Ativo: 1 
    }

    static async getAll(){
        const [rows] = await db.query(`SELECT 
                                            usuario.ID,
                                            usuario.IDGrupo_Usuarios,
                                            grupo_usuarios.Nome as NomeGrupoUsuarios,
                                            usuario.Nome,
                                            usuario.Login,
                                            usuario.Ativo
                                            
                                        FROM usuario 
                                        INNER JOIN grupo_usuarios ON grupo_usuarios.ID = usuario.IDGrupo_Usuarios
                                        ORDER BY NOME`);
        return rows;
    }

    static async getAtivos(){
        const [rows] = await db.query(`SELECT 
                                            usuario.ID,
                                            usuario.IDGrupo_Usuarios,
                                            grupo_usuarios.Nome as NomeGrupoUsuarios,
                                            usuario.Nome,
                                            usuario.Login,
                                            usuario.Ativo
                                            
                                        FROM usuario 
                                        INNER JOIN grupo_usuarios ON grupo_usuarios.ID = usuario.IDGrupo_Usuarios
                                        WHERE usuario.Ativo = 1
                                        ORDER BY NOME`);
        return rows;
    }

    static async Get(id){
        let [rows] = await db.query(`SELECT 
                                            usuario.ID,
                                            usuario.IDGrupo_Usuarios,
                                            grupo_usuarios.Nome as NomeGrupoUsuarios,
                                            usuario.Nome,
                                            usuario.Login,
                                            usuario.Ativo
                                            
                                        FROM usuario 
                                        INNER JOIN grupo_usuarios ON grupo_usuarios.ID = usuario.IDGrupo_Usuarios
                                        WHERE usuario.ID = ?
                                        ORDER BY NOME`, [id]);
        if(rows[0].ID >0){
            rows[0].Grupo_Usuarios = await Grupo_Usuarios.get(rows[0].IDGrupo_Usuarios)
        }                                        
        return rows[0];
    }

    static async existeLogin(login, ID = null){
        if(!ID){
            const [rows] = await db.query('SELECT COUNT(*) AS NUM_USU FROM usuario WHERE LOGIN = ?',[login]);
            return rows[0].NUM_USU > 0;
        }
        const [rows] = await db.query('SELECT COUNT(*) AS NUM_USU FROM usuario WHERE LOGIN = ? AND ID <> ?',[login,ID]);
        return rows[0].NUM_USU >0;
    }

    async Insert(){
        //ID, IDGrupo_Usuarios, Nome, Login, Senha, Ativo
        const values = [this.IDGrupo_Usuarios,this.Nome,this.Login,getHash(this.Senha),this.Ativo];
        const [rows] = await db.query(`INSERT INTO usuario
                                    (IDGrupo_Usuarios, Nome, Login, Senha, Ativo)
                                    VALUES
                                    (?,?,?,?,?)`,values);
        return await Usuario.Get(rows.insertId);
    }

    async Update(){
        //ID, IDGrupo_Usuarios, Nome, Login, Senha, Ativo
        const values = [this.IDGrupo_Usuarios,this.Nome,this.Login,this.Ativo,this.ID];
        const [rows] = await db.query(`UPDATE usuario 
                                        SET
                                            IDGrupo_Usuarios = ?, 
                                            Nome = ?, 
                                            Login =?, 
                                            Ativo =?
                                        WHERE ID = ?`,values);
        return await Usuario.Get(this.ID);

    }

    static async GetByLoginSenha(login,senha){
        const values =[login,getHash(senha)];
        const [rows] = await db.query('SELECT ID FROM usuario WHERE UPPER(LOGIN) = UPPER(?) AND Senha = ?;',values);
        const dados = rows[0];
        if (dados){

            let usr = await Usuario.Get(dados?.ID);
            if(usr?.ID){
                usr.token = jwt.sign({id:[usr.ID]},process.env.SECRET,{expiresIn:86400});
                usr.auth = true;
            }
            return  usr;
        }
        return dados;
    }

    static async GetByIdSenha(id,senha){
        const values = [id,getHash(senha)];
        const [rows] = await db.query('SELECT ID FROM usuario WHERE ID = ? AND Senha = ?;',values);
        const dados = rows[0];
        return  await Usuario.Get(dados?.ID);
    }

    static async AlteraSenha(id,NovaSenha){
        const user = await this.Get(id);
        if (user?.ID > 0){
            const values = [getHash(NovaSenha),id];
            const [rows] = await db.query('UPDATE usuario SET SENHA = ?  WHERE ID = ?',values);
        }
        return user;
    }
}

export default Usuario;