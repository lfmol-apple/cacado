

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

import { Insumo } from "./insumo";

const URL_API = environment.apiUrl;

@Injectable({
    providedIn:'root'
})
export class InsumoService{
    constructor(
        private http: HttpClient
    ){}

    getAll(){
        return this.http.get<Insumo[]>(`${URL_API}insumo`)
      }
    getAtivos(){
        return this.http.get<Insumo[]>(`${URL_API}insumo/Ativos`)
    }
    Get(ID:number){
        return this.http.get<Insumo>(`${URL_API}insumo/${ID}`)
    }

    getAutoComplete(dados:string){
        return this.http.get<Insumo[]>(`${URL_API}insumo/autocomplete/${dados}`)
    }
      
    verificaNome(nome:string,id:any){
        return this.http.get<Insumo>(`${URL_API}insumo/existeNome/${nome}/${id}`)
    }

    Insert(dados:Insumo){
        return this.http.post(`${URL_API}insumo`,dados)
    }
    
    Update(dados:Insumo){
        return this.http.put(`${URL_API}insumo`,dados)
    }
    
}

