

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Galpao } from "./galpao";

const API_URL = environment.apiUrl + 'galpoes';

@Injectable({
    providedIn: 'root'
})
export class GalpaoService{
    constructor(
        private http:HttpClient
    ){}

    getAll(){
        return this.http.get<Galpao[]>(API_URL);
    }

    getAtivos(){
        return this.http.get<Galpao[]>(`${API_URL}/ativos`)
    }

    Get(ID:number){
        return this.http.get<Galpao>(API_URL+`/${ID}`)
    }
    Insert(dados:Galpao){
        return this.http.post(API_URL,dados)
    }
    Update(dados:Galpao){
        return this.http.put(API_URL+`/${dados.ID}`,dados)
    }
}