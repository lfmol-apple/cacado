import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { ResponseBody } from 'app/core/auth/responseBody';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/shared/components/alert/alert.service';

@Component({
    templateUrl:'./signin.component.html',
    styleUrls:[
        'signin.component.css'
    ]
})
export class SigninComponent implements OnInit{

  //  fromUrl:string;
    loginForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private alertService: AlertService
    ){}

    ngOnInit(): void {
         this.userService.logOut();
        this.loginForm = this.formBuilder.group({
            login: ['',Validators.required],
            senha: ['', Validators.required]
        })        
    }

    login() {
        const login = this.loginForm.get('login').value;
        const senha = this.loginForm.get('senha').value;
        this.authService
            .authenticate(login,senha)
            .subscribe({
                next:res =>{
                    let body = res.body as ResponseBody;
                    if (body.auth){
                        this.router.navigate(['dashboard'])
                    }
                    else{
                        console.log("Erro ao fazer login")
                        this.alertService.danger("Usário ou senha inválidos");
                    }
                },
                error:err => {
                    console.log(err);
                    console.log("Erro ao fazer login")
                    this.alertService.danger("Usário ou senha inválidos");
                      
                }
            })
       }
}