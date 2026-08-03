

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

import { Produto } from "./produto";

const URL_API = environment.apiUrl;

@Injectable({
    providedIn:'root'
})
export class ProdutoService{
    constructor(
        private http: HttpClient
    ){}

    getAll(){
        return this.http.get<Produto[]>(`${URL_API}produto`)
      }
    getAtivos(){
        return this.http.get<Produto[]>(`${URL_API}produto/Ativos`)
    }
    Get(ID:number){
        return this.http.get<Produto>(`${URL_API}produto/${ID}`)
    }

    getAutoComplete(dados:string){
        return this.http.get<Produto[]>(`${URL_API}produto/autocomplete/${dados}`)
    }
      
    verificaNome(nome:string,id:any){
        return this.http.get<Produto>(`${URL_API}produto/existeNome/${nome}/${id}`)
    }

    Insert(dados:Produto){
        return this.http.post(`${URL_API}produto`,dados)
    }
    
    Update(dados:Produto){
        return this.http.put(`${URL_API}produto`,dados)
    }
    
}

