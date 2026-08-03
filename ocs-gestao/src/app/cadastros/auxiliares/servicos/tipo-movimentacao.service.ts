import { HttpClient, HttpDownloadProgressEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { TipoMovimentacao } from "./tipo-movimentacao";

const API_URL = environment.apiUrl;

@Injectable({
    providedIn:'root'
})
export class TipoMovimentacaoService{
    constructor(
        private http: HttpClient
    ){}

    getAll(){
        return this.http.get<TipoMovimentacao[]>(`${API_URL}tipo_movimentacao`);
    }
    getAtivos(){
        return this.http.get<TipoMovimentacao[]>(`${API_URL}tipo_movimentacao/Ativos`);
    }
    Get(ID:number){
        return this.http.get<TipoMovimentacao>(`${API_URL}tipo_movimentacao/${ID}`);
    }

    VerificaNome(Nome:string,ID:any){
        return this.http.get<boolean>(`${API_URL}tipo_movimentacao/VerificaNome/${Nome}/${ID}`);
    }

    Insert(dados:TipoMovimentacao){
        return this.http.post<TipoMovimentacao>(`${API_URL}tipo_movimentacao`,dados);
    }

    Update(dados:TipoMovimentacao){
        return this.http.put<TipoMovimentacao>(`${API_URL}tipo_movimentacao`,dados);
    }

}