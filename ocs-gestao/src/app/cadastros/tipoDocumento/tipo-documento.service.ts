

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

import { TipoDocumento } from "./tipo-documento";

const URL_API = environment.apiUrl;

@Injectable({
    providedIn:'root'
})
export class TipoDocumentoService{
    constructor(
        private http: HttpClient
    ){}

    getAll(){
        return this.http.get<TipoDocumento[]>(`${URL_API}tipo_documento`)
      }
    Get(ID:number){
        return this.http.get<TipoDocumento>(`${URL_API}tipo_documento/${ID}`)
    }

    
}

