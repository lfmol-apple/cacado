import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

@Injectable()
export class RequestIterceptor implements HttpInterceptor{

    constructor(
        private tokenService: TokenService,
        private userService: UserService
    ){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(this.tokenService.hasToken()){
            const token = this.tokenService.getToken();
            const userID = this.userService.getUserID()
            req = req.clone({
                setHeaders:{
                    'Authorization': 'Bearer ' + token,
                    'userID': userID != null? userID: ''
                }
            })
        }
        return next.handle(req);
    }
}