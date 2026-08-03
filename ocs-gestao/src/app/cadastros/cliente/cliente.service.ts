import { HttpClient, HttpDownloadProgressEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Cliente } from "./cliente";

const API_URL = environment.apiUrl;

@Injectable({
    providedIn:'root'
})
export class ClienteService{
    constructor(
        private http:HttpClient
    ){}

    getAll(){
        return this.http.get<Cliente[]>(API_URL + 'cliente')
    }
    getAtivos(){
        return this.http.get<Cliente[]>(API_URL + 'cliente/ativos')
    }

    Get(ID:number){
        return this.http.get<Cliente>(API_URL + `Cliente/${ID}`);
    }

    verificaNome(nome:string,id:any){
        return this.http.get<boolean>(`${API_URL}cliente/verificanome/${nome}/${id}`);
    }
    
    verificaRazaoSocial(razaoSocial:string,id:any){
        return this.http.get<boolean>(`${API_URL}cliente/verificarazaosocial/${razaoSocial}/${id}`);
    }

    Insert(cliente:Cliente){
        return this.http.post<Cliente>(`${API_URL}cliente`,cliente);
    }
    Update(cliente:Cliente){
        return this.http.put<Cliente>(`${API_URL}cliente`,cliente);
    }

    getAutocomplete(dados:string){
        return this.http.get<Cliente[]>(`${API_URL}cliente/autocomplete/${dados}`)
    }
}