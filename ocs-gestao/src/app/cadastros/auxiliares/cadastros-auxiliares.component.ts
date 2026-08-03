import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TipoMovimentacao } from './servicos/tipo-movimentacao';
import { TipoMovimentacaoService } from './servicos/tipo-movimentacao.service';
import { AlertService } from 'app/shared/components/alert/alert.service';
import { CadastrosAuxiliaresValidators } from './servicos/cadastros-auxiliares.validators.services';

declare var $:any

@Component({
    templateUrl: './cadastros-auxiliares.component.html'   ,
    styleUrls:['./cadastros-auxiliares.component.css'],
    providers:[CadastrosAuxiliaresValidators]
})
export class CadastrosAuxiliaresComponent implements OnInit{

    TiposMovimentacao :TipoMovimentacao[];
    formTipoMovimentacao: FormGroup;
    idTipoMovimentacao:number
    
    constructor(
        private tipoMovimentacaoService: TipoMovimentacaoService,
        private alertService:AlertService,
        private router:Router,
        private formBuilder: FormBuilder,
        private cadastrosAuxiliaresValidators: CadastrosAuxiliaresValidators
    ){}

    ngOnInit(): void {

        this.formTipoMovimentacao =  this.formBuilder.group({
            Nome: ['',Validators.required],
            Credito: [false,Validators.required],
            Ativo: [1]
        })
        this.formTipoMovimentacao.get('Nome').updateValueAndValidity();

        this.recuperaTiposMovimentacao();
    }

    //#region  TIPOS DE MOVIMENTAÇão

    recuperaTiposMovimentacao(){
        this.tipoMovimentacaoService.getAll()
        .subscribe({
            next: res =>{
                this.TiposMovimentacao = res;
            },
            error: err =>{
                console.log(err);
            }
        })
    }

    limpaFormTipoMovimentacao(){
        this.formTipoMovimentacao.get('Nome').setValue('') ;
        this.formTipoMovimentacao.get('Credito').setValue(false) ;
        this.formTipoMovimentacao.get('Ativo').setValue(1) ;
    }

    exibeEditTipoMovimetacao(){
        this.formTipoMovimentacao.get('Nome').clearValidators();
        this.formTipoMovimentacao.get('Nome').addValidators(Validators.required);
        this.formTipoMovimentacao.get('Nome').addAsyncValidators(this.cadastrosAuxiliaresValidators.checkIfTipoMovimentacaoExists(this.idTipoMovimentacao))
        $('#btnNovoTipoMovimentacao').slideUp(200);
        $('#listaTiposMovimentacao').slideUp(200,() =>{
            $('#edtiTipoMovimentacao').slideDown(200);

        });        
    }

    editaTipoMovimentacao(dados){
        this.limpaFormTipoMovimentacao();
        this.idTipoMovimentacao = dados.ID;
        this.formTipoMovimentacao.patchValue({
            Nome: dados.Nome,
            Credito: dados.Credito?.data[0] == 1,
            Ativo: dados.Ativo?.data[0]
        })
        this.exibeEditTipoMovimetacao()
    }

    novoTipoMovimentacao(){
        this.limpaFormTipoMovimentacao();
        this.idTipoMovimentacao = -1;
        this.exibeEditTipoMovimetacao()
    }

    salvaTipoMovimentacao(){
        let dados:TipoMovimentacao = this.formTipoMovimentacao.getRawValue() as TipoMovimentacao;
        if (this.formTipoMovimentacao.valid){
            if (this.idTipoMovimentacao == -1){
                this.tipoMovimentacaoService.Insert(dados)
                .subscribe({
                    next: res =>{
                        this.recuperaTiposMovimentacao();
                        this.cancelaTipoMovimentacao()
                    }
                })
            }
            else{
                dados.ID =this.idTipoMovimentacao;
                this.tipoMovimentacaoService.Update(dados)
                .subscribe({
                    next: res =>{
                        this.recuperaTiposMovimentacao();
                        this.cancelaTipoMovimentacao()
                    }
                })                
            }
        }
    }
    cancelaTipoMovimentacao(){
        $('#btnNovoTipoMovimentacao').slideDown(200);
        $('#edtiTipoMovimentacao').slideUp(200,() =>{
            $('#listaTiposMovimentacao').slideDown(200);
        });       
    }
    //#endregion
}