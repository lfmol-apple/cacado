import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { debounceTime, switchMap, map, first, retry } from 'rxjs/operators';


import { ClienteService } from "./cliente.service";

@Injectable()
export class ClienteValidators{
    constructor(
        private clienteService:ClienteService
    ){}
    checkIfRazaoSocialExists(idCliente:number){
        return (control:AbstractControl ) =>{
            return control
                .valueChanges
                .pipe(debounceTime(300))
                .pipe(switchMap(razaoSocial =>
                    this.clienteService.verificaRazaoSocial(razaoSocial,(idCliente > 0?idCliente:null))
                ))
                .pipe(map(Exists => Exists ? { razaoSocialExists: true } : null))
                .pipe(first());
        }
    }
    checkIfNomeExists(idCliente:number){
        return (control:AbstractControl ) =>{
            return control
                .valueChanges
                .pipe(debounceTime(300))
                .pipe(switchMap(nome =>
                    this.clienteService.verificaNome(nome,(idCliente > 0?idCliente:null))
                ))
                .pipe(map(Exists => Exists ? { nomeExists: true } : null))
                .pipe(first());
        }
       
    }

}