import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

import { Venda,listaVendas } from "./venda";
import { VendaFiltro } from "./venda-filtro";
import { VendaItem } from "./venda-item";

const URL_API = environment.apiUrl;

@Injectable({
    providedIn:'root'
})
export class VendaService{
    constructor(
        private http: HttpClient
    ){}

    getAll(){
        return this.http.get<Venda[]>(`${URL_API}venda`)
    }
    getbyFiltros(Filtro:VendaFiltro){
        return this.http.get<listaVendas>(`${URL_API}venda/busca/${JSON.stringify(Filtro)}`)
    }
    Get(ID:number){
        return this.http.get<Venda>(`${URL_API}venda/${ID}`)
    }
    Insert(Venda:Venda){
        return this.http.post(`${URL_API}venda/`,Venda)
    }

    Update(Venda:Venda){
        return this.http.put(`${URL_API}venda/`,Venda)
    }

    Delete(ID:number){
        return this.http.delete(`${URL_API}venda/${ID}`)
    }


    
}

