

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

import { FormaPagamento } from "./forma-pagamento";

const URL_API = environment.apiUrl;

@Injectable({
    providedIn:'root'
})
export class FormaPagamentoService{
    constructor(
        private http: HttpClient
    ){}

    getAll(){
        return this.http.get<FormaPagamento[]>(`${URL_API}forma_pagamento`)
      }
    Get(ID:number){
        return this.http.get<FormaPagamento>(`${URL_API}forma_pagamento/${ID}`)
    }

    
}

