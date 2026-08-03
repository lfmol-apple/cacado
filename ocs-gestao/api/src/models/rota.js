import db from "../config/dbConnect.js";

class Rota{

    static async GetAll(){
        const [rows] = await db.query('SELECT * FROM rota');
        return rows;

    }

    static async Get(ID){
        const [rows] = await db.query('SELECT * FROM rota WHERE ID = ?',[ID]);
        return rows;
    }

    static async GetByGrupo(IDGrupo){
        const [rows] = await db.query(`SELECT rota.* ,
                                        (SELECT CASE WHEN COUNT(*) > 0 THEN b'1' ELSE b'0' END FROM rota_grupo_usuarios WHERE IDRota = Rota.ID AND IDGrupo_Usuarios = ?) Enabled 
                                        FROM rota`,[IDGrupo]);
        return rows;
    }

   static async GetByUsuario(IDUsuario) {
        const [rows] = await db.query(`SELECT
                                            path, title, icon, class
                                            FROM rota
                                            INNER JOIN rota_grupo_usuarios ON rota_grupo_usuarios.IDrota = rota.ID
                                            INNER JOIN grupo_usuarios ON grupo_usuarios.ID = rota_grupo_usuarios.IDgrupo_usuarios
                                            INNER JOIN usuario ON usuario.IDGrupo_Usuarios = grupo_usuarios.ID
                                            WHERE usuario.ID = ?`,[IDUsuario]);
        return rows;    
   }

}

export default Rota;