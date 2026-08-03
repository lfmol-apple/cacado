import db from "../config/dbConnect.js";

class RotaGrupoUSuarios{

    constructor(dados){
        //ID, IDRota, IDGrupo_Usuarios
        this.ID = dados?.ID;
        this.IDRota = dados?.IDRota;
        this.IDGrupo_Usuarios;
    }

    static async GrupoPossuiRota(IDGrupo_Usuarios,IDRota){
        console.log(IDGrupo_Usuarios,IDRota)
        const [rows] = await db.query(`SELECT COUNT(*) > 0  AS Existe FROM rota_grupo_usuarios WHERE IDGrupo_Usuarios = ? AND IDRota = ?`,[IDGrupo_Usuarios,IDRota]);
        if (rows.length > 0){
            return rows[0].Existe;
        }
    }

    static async Insert(IDRota,IDGrupo_Usuarios){
        await db.execute(`INSERT INTO rota_grupo_usuarios
        (IDRota, IDGrupo_Usuarios)
        VALUES
        (?,?)`,[IDRota,IDGrupo_Usuarios]);
        return true;
    }
    static async Delete(IDRota,IDGrupo_Usuarios){
        await db.execute(`DELETE FROM rota_grupo_usuarios
                         WHERE IDRota = ? AND IDGrupo_Usuarios= ?`,[IDRota,IDGrupo_Usuarios]);
        return true;
    }

    static async Configura(IDRota,IDGrupo_Usuarios){
        let PossuiRota = await RotaGrupoUSuarios.GrupoPossuiRota(IDGrupo_Usuarios,IDRota);
        console.log(PossuiRota)
        if(PossuiRota == 1){
            RotaGrupoUSuarios.Delete(IDRota,IDGrupo_Usuarios);
        }
        else{
            RotaGrupoUSuarios.Insert(IDRota,IDGrupo_Usuarios);
        }
    }

}

export default RotaGrupoUSuarios