import { Injectable } from "@angular/core";
import { debounceTime, switchMap, map, first, retry } from 'rxjs/operators';
import { AbstractControl } from "@angular/forms";


import { TipoMovimentacaoService } from "./tipo-movimentacao.service";

@Injectable()
export class CadastrosAuxiliaresValidators{
    constructor(
        private tipoMovimentacaoService:TipoMovimentacaoService
    ){}

    checkIfTipoMovimentacaoExists(id:number){
        return (control:AbstractControl ) =>{
            return control
                .valueChanges
                .pipe(debounceTime(300))
                .pipe(switchMap(nome =>
                    this.tipoMovimentacaoService.VerificaNome(nome,(id > 0?id:null))
                ))
                .pipe(map(Exists => Exists ? { tipoMovimentacaoExists: true } : null))
                .pipe(first());
        }
    }

}
