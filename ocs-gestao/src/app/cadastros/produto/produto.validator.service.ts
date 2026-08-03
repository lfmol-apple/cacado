import { Injectable } from "@angular/core";
import { ProdutoService } from "./produto.service";

import { AbstractControl } from "@angular/forms";

import { debounceTime, switchMap, map, first, retry } from 'rxjs/operators';
import { of } from "rxjs";

@Injectable()
export class ProdutoValidators{
    constructor(
        private produtoService:ProdutoService
    ){}

    checkIfNomeExists(idProduto:number){
        return (control:AbstractControl ) =>{
            return control
                .valueChanges
                .pipe(debounceTime(300))
                .pipe(switchMap(nome =>
                    this.produtoService.verificaNome(nome,(idProduto > 0?idProduto:null))
                ))
                .pipe(map(Exists => Exists ? { nomeExists: true } : null))
                .pipe(first());
        }
       
    }

}