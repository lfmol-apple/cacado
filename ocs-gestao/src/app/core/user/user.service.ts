import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Token } from '../token/token';
import { TokenService } from '../token/token.service';
import  jwt_decode from 'jwt-decode'

@Injectable({providedIn:'root'})
export class UserService{
    private userSubject = new BehaviorSubject<Token>(null);
    private userName: string;
    private userID: string;

    constructor(private tokenService: TokenService){
        this.tokenService.hasToken() &&
        this.decodeAndNotify()
    }
    setToken(token: string){
        this.tokenService.setToken(token);
        this.decodeAndNotify();
    }
    
    getUserID(){
        return this.userID;
    }
    getUser(){
        return this.userSubject.asObservable();
    }

    private decodeAndNotify(){
        const token = this.tokenService.getToken();
        const tokenData = jwt_decode<Token>(token);
        this.userName = tokenData.usuario;
        this.userID = tokenData.id;
        this.userSubject.next(tokenData);
    }

    logOut(){
        this.tokenService.removeToken();
        this.userSubject.next(null);
    }

    isLogged(){
        return this.tokenService.hasToken();
    }

    getUserName(){
        return this.userSubject;
    }
}