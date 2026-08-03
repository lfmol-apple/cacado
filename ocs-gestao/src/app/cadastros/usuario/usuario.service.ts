import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Usuario } from "./usuario";

const URL_API = environment.apiUrl + 'usuario'

@Injectable({
    providedIn:'root'
})
export class UsuarioService{
    constructor(
        private http: HttpClient
    ){}
    getAll(){
        return this.http.get<Usuario[]>(URL_API);
    }

    getAtivos(){
        return this.http.get<Usuario[]>(URL_API+'/ativos');
    }

    Get(ID:number){
        return this.http.get<Usuario>(URL_API + `/${ID}`);        
    }

    verificaLogin(ID:number,login:string){
        return this.http.get<boolean>(`${URL_API}/${login}/${ID}`);        
    }

    Insert(dados:Usuario){
        return this.http.post(URL_API,dados);
    }

    Update(dados:Usuario){
        return this.http.put(URL_API,dados);
    }

    AlteraSenha(ID:number,NovaSenha:string){
        return this.http.patch(URL_API +'/alteraSenha',{ID,NovaSenha});
    }
}