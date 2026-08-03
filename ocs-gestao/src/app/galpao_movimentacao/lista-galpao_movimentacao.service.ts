import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { DadosMovimentacao, GalpaoMovimentacao } from "./galpao_movimentacao";
import { GalpaoMovimentacaoFiltro } from "./galpao_movimentacao-filtro";

const URL_API = environment.apiUrl;

@Injectable({
    providedIn:'root'
})
export class GalpaoMovimentacaoService{

    constructor(
        private http: HttpClient
    ){}

    get(ID:number){
        return this.http.get<GalpaoMovimentacao>(`${URL_API}movimentacoes/${ID}`);
    }

    getByGalpao(IDGalpao:number){
        return this.http.get(`${URL_API}movimentacoes/galpao/${IDGalpao}`);
    }

    getByData(Data:Date){
        return this.http.get(`${URL_API}movimentacoes/data/${Data}`);
    }

    getByFiltros(Filtro:GalpaoMovimentacaoFiltro){
        return this.http.get<DadosMovimentacao>(`${URL_API}movimentacoes/busca/${JSON.stringify(Filtro)}`);
    }


    insert(Dados:GalpaoMovimentacao){
        return this.http.post<GalpaoMovimentacao>(`${URL_API}movimentacoes`,Dados);
    }

    update(Dados:GalpaoMovimentacao){
        return this.http.put<GalpaoMovimentacao>(`${URL_API}movimentacoes/${Dados.ID}}`,Dados)
    }

    delete(ID: number){
        return this.http.delete(`${URL_API}movimentacoes/${ID}`)
    }


}