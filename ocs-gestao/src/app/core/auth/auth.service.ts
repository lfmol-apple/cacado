import { Injectable, ɵConsole } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators'

import { UserService } from '../user/user.service';
import { ResponseBody } from './responseBody';
import { User } from '../user/user';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({providedIn:'root'})
export class AuthService{

    constructor(
        private http: HttpClient,
        private userService:UserService
    ){}

    authenticate(Login:string, Senha:string){
        return this.http.post(
            API_URL+'usuario/Login',
            {Login,Senha},
            {observe: 'response'}
        )
        .pipe(tap(res=>{
            let body = res.body as ResponseBody;
            if (body.auth){
                const authToken = body.token;
                authToken && this.userService.setToken(authToken);
            }
        }))
    }
}
