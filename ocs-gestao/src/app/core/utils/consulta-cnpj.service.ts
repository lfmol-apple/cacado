import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "environments/environment";

const URL_API = environment.apiUrl;

@Injectable({
    providedIn:'root'
})
export class ConsultaCnpjService{

    constructor(
        private http: HttpClient
    ){}

    Consulta(cnpj:string){

        return this.http.get(URL_API +'consulta_cnpj/'+ cnpj)
    }
}