import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { GrupoUsuarios } from "./grupo-usuarios";

const API_URL = environment.apiUrl + 'grupo_usuarios';

@Injectable({
    providedIn: 'root'
})
export class GrupoUsuariosService{
    constructor(
        private http:HttpClient
    ){}

    getAll(){
        return this.http.get<GrupoUsuarios[]>(API_URL);
    }

    Get(ID:number){
        return this.http.get<GrupoUsuarios>(API_URL+`/${ID}`)
    }
    GetAtivos(){
        return this.http.get<GrupoUsuarios[]>(API_URL+'_ativos')
    }
    Insert(dados:GrupoUsuarios){
        return this.http.post(API_URL,dados)
    }
    Update(dados:GrupoUsuarios){
        return this.http.put(API_URL,dados)
    }
}