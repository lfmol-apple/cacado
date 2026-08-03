import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Fornecedor } from "./fornecedor";

const API_URL = environment.apiUrl;

@Injectable({
    providedIn:'root'
})
export class FornecedorService{
    constructor(
        private http:HttpClient
    ){}

    getAll(){
        return this.http.get<Fornecedor[]>(API_URL + 'fornecedor')
    }
    getAtivos(){
        return this.http.get<Fornecedor[]>(API_URL + 'fornecedor/ativos')
    }

    Get(ID:number){
        return this.http.get<Fornecedor>(API_URL + `Fornecedor/${ID}`);
    }

    verificaNome(nome:string,id:any){
        return this.http.get<boolean>(`${API_URL}fornecedor/verificanome/${nome}/${id}`);
    }
    
    verificaRazaoSocial(razaoSocial:string,id:any){
        return this.http.get<boolean>(`${API_URL}fornecedor/verificarazaosocial/${razaoSocial}/${id}`);
    }

    Insert(fornecedor:Fornecedor){
        return this.http.post<Fornecedor>(`${API_URL}fornecedor`,fornecedor);
    }
    Update(fornecedor:Fornecedor){
        return this.http.put<Fornecedor>(`${API_URL}fornecedor`,fornecedor);
    }
    getAutocomplete(dados:string){
        return this.http.get<Fornecedor[]>(`${API_URL}fornecedor/autocomplete/${dados}`)
    }    
}