import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { environment } from "environments/environment";
import { Rota } from "./rota";

const API_URL = environment.apiUrl + 'rota';

@Injectable({
    providedIn:'root'
})

export class RotaService{

    constructor(
        private http:HttpClient
    ){}

    getAll(){
        return this.http.get<Rota[]>(API_URL)
    }
    Get(ID){
        return this.http.get<Rota>(API_URL)
    }
    GetByGrupo(IDGrupo:number){
        return this.http.get<Rota[]>(`${API_URL}/grupo/${IDGrupo}`)
    }
    GetByUsuario(IDUsuario:number){
        return this.http.get<Rota[]>(`${API_URL}/usuario/${IDUsuario}`)
    }
    ConfiguraGrupo(IDRota:number,IDGrupo:number){
        return this.http.get(`${API_URL}/configuragrupo/${IDRota}/${IDGrupo}`)
    }
}