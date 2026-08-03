import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

import { UnidadeMedida } from "./unidadeMedida";

const URL_API = environment.apiUrl;

@Injectable({
    providedIn:'root'
})
export class UnidadeMedidaService{
    constructor(
        private http: HttpClient
    ){}

   getAll(){
     return this.http.get<UnidadeMedida[]>(`${URL_API}unidade_medida`)
   }

}