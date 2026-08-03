import { Injectable } from "@angular/core";
import { FornecedorService } from "./forncedor.service";
import { Fornecedor } from "./fornecedor";

import { AbstractControl } from "@angular/forms";

import { debounceTime, switchMap, map, first, retry } from 'rxjs/operators';
import { of } from "rxjs";

@Injectable()
export class FornecedorValidators{
    constructor(
        private fornecedorService:FornecedorService
    ){}
    checkIfRazaoSocialExists(idFornecedor:number){
        return (control:AbstractControl ) =>{
            if (!control.valueChanges) {
                return of(null);
            } else {
                return control
                    .valueChanges
                    .pipe(debounceTime(300))
                    .pipe(switchMap(razaoSocial =>
                        this.fornecedorService.verificaRazaoSocial(razaoSocial?.length > 0?razaoSocial:null,(idFornecedor > 0?idFornecedor:null))
                    ))
                    .pipe(map(Exists => Exists ? { razaoSocialExists: true } : null))
                    .pipe(first());
              }

        }
    }
    checkIfNomeExists(idFornecedor:number){
        return (control:AbstractControl ) =>{
            return control
                .valueChanges
                .pipe(debounceTime(300))
                .pipe(switchMap(nome =>
                    this.fornecedorService.verificaNome(nome,(idFornecedor > 0?idFornecedor:null))
                ))
                .pipe(map(Exists => Exists ? { nomeExists: true } : null))
                .pipe(first());
        }
       
    }

}