import { Injectable } from "@angular/core";
import { InsumoService } from "./insumo.service";

import { AbstractControl } from "@angular/forms";

import { debounceTime, switchMap, map, first, retry } from 'rxjs/operators';


@Injectable()
export class InsumoValidators{
    constructor(
        private insumoService:InsumoService
    ){}

    checkIfNomeExists(idInsumo:number){
        return (control:AbstractControl ) =>{
            return control
                .valueChanges
                .pipe(debounceTime(300))
                .pipe(switchMap(nome =>
                    this.insumoService.verificaNome(nome,(idInsumo > 0?idInsumo:null))
                ))
                .pipe(map(Exists => Exists ? { nomeExists: true } : null))
                .pipe(first());
        }
       
    }

}