import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Rota } from "app/core/rota/rota";
import { RotaService } from "app/core/rota/rota.service";
import { AlertService } from "app/shared/components/alert/alert.service";
import { Galpao } from "./galpao";
import { GalpaoService } from "./galpao.service";

declare var $:any

@Component({
    templateUrl:'lista-galpao.component.html',
    styleUrls:[
        'lista-galpao.component.css'
    ]
})
export class ListaGalpaoComponent implements OnInit{

    galpoes: Galpao[];
    formGalpao: FormGroup;
    idGalpao:number;
    Rotas: Rota[];

    constructor(
        private galpaoService: GalpaoService,
        private alertService: AlertService,
        private router:Router,
        private formBuilder: FormBuilder,
        private rotaService: RotaService
    ){}

    ngOnInit(): void {
        this.idGalpao = -1;
        this.formGalpao = this.formBuilder.group({
            Nome:[null,Validators.required],
            NumAves:[0],
            Ativo:[true]
        })
        this.recuperaGalpoes();
    }

    recuperaGalpoes(){
        this.galpaoService.getAll()
        .subscribe({
            next: res =>{
                this.galpoes = res;
            },
            error: err =>{
                this.alertService.danger("Erro aor recuperar galpões")
                console.log(err);
            }
        })
    }

    editaGalpao(dados:Galpao){

        this.idGalpao = dados.ID;
        this.formGalpao.get('Nome').setValue(dados.Nome);
        this.formGalpao.get('NumAves').setValue(dados.NumAves);
        this.formGalpao.get('Ativo').setValue(dados.Ativo == 1);
        this.exibeEdit();
        this.recuperaRotasGrupos(this.idGalpao);
    }


    NovoGalpao(){
        this.idGalpao = -1;
        this.formGalpao.get('Nome').setValue('');
        this.formGalpao.get('NumAves').setValue(0);
        this.formGalpao.get('Ativo').setValue(true);
        this.exibeEdit();
    }

    exibeEdit(){
        $('#btnNovo').hide()
        $('#listaGalpoes').hide(200,()=>{
            $('#editGalpoes').show();
       })
    }

    cancelaEdit(){
        $('#btnNovo').show()
        $('#editGalpoes').hide(200,()=>{
            $('#listaGalpoes').show();
       })       
    }

    salvaGalpao(){
        if(this.formGalpao.valid){
            let dados:Galpao = this.formGalpao.getRawValue() as Galpao;
            dados.ID = this.idGalpao;
            if(this.idGalpao == -1){
                this.galpaoService.Insert(dados)
                .subscribe({
                    next: res =>{
                        this.alertService.success("Galpao salvo com sucesso");
                        this.cancelaEdit()
                        this.recuperaGalpoes();
                    },
                    error: err =>{
                        console.log(err);
                        this.alertService.danger("Erro ao cadastrar galpão")
                    }
                })
            }
            else{
        
                this.galpaoService.Update(dados)
                .subscribe({
                    next: res =>{
                        this.alertService.success("Galpão atualizado com sucesso");
                        this.cancelaEdit();
                        this.recuperaGalpoes();
                    },
                    error: err =>{
                        console.log(err);
                        this.alertService.danger("Erro ao atualizar galpão")
                    }
                })
                
            }
        }
    }

    recuperaRotasGrupos(idGrupoUsuarios: number){
        this.rotaService.GetByGrupo(idGrupoUsuarios)
        .subscribe({
            next: res =>{
                this.Rotas = res
                console.log(res);
            },
            error: err =>{
                this.alertService.danger("Erro ao recuperar dados de permissões");
                console.log(err);
            }
        })
    }

    toogglePermissao(idGrupo:number,idRota:number){
        this.rotaService.ConfiguraGrupo(idRota,idGrupo)
        .subscribe({
            next: res =>{
                this.recuperaRotasGrupos(this.idGalpao)
            },
            error: err =>{
                this.alertService.danger("Erro ao recuperar dados de permissões");
                console.log(err);
            }
        })       
    }
}