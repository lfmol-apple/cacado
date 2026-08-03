import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const URL_API = environment.apiUrl+'dashboard';

@Injectable({
    providedIn:'root'
})
export class DashboardService{

    constructor(
        private http :HttpClient
    ){

    }
    getDasboard(){
        return this.http.get<any>(URL_API);
    }
}