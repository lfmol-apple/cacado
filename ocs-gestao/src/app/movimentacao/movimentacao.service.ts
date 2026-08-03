import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

import { Movimentacao,listaMovimentacao,TotalMovimentacao} from "./movimentacao";
import { MovimentacaoFiltro } from "./movimentacao-filtro";

const URL_API = environment.apiUrl;

@Injectable({
    providedIn:'root'
})
export class MovimentacaoService{
    constructor(
        private http: HttpClient
    ){}


    getbyFiltros(Filtro:MovimentacaoFiltro){
        return this.http.get<listaMovimentacao>(`${URL_API}movimentacao/busca/${JSON.stringify(Filtro)}`)
    }
    Get(ID:number){
        return this.http.get<Movimentacao>(`${URL_API}movimentacao/${ID}`)
    }
    Insert(Movimentacao:Movimentacao){
        return this.http.post(`${URL_API}movimentacao/`,Movimentacao)
    }

    toggleConferido(ID:number){
        return this.http.get(`${URL_API}movimentacao/toggleConferido/${ID}`)
    }
    Update(Movimentacao:Movimentacao){
        return this.http.put(`${URL_API}movimentacao/`,Movimentacao)
    }

    Delete(ID:number){
        return this.http.delete(`${URL_API}movimentacao/${ID}`)
    }


    
}

