import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

import { Compra,listaCompras } from "./compra";
import { CompraFiltro } from "./compra-filtro";
import { CompraItem } from "./compra-item";

const URL_API = environment.apiUrl;

@Injectable({
    providedIn:'root'
})
export class CompraService{
    constructor(
        private http: HttpClient
    ){}

    getAll(){
        return this.http.get<Compra[]>(`${URL_API}compra`)
    }
    getbyFiltros(Filtro:CompraFiltro){
        return this.http.get<listaCompras>(`${URL_API}compra/busca/${JSON.stringify(Filtro)}`)
    }
    Get(ID:number){
        return this.http.get<Compra>(`${URL_API}compra/${ID}`)
    }
    Insert(Compra:Compra){
        return this.http.post(`${URL_API}compra/`,Compra)
    }

    Update(Compra:Compra){
        return this.http.put(`${URL_API}compra/`,Compra)
    }

    Delete(ID:number){
        return this.http.delete(`${URL_API}compra/${ID}`)
    }

    
}

