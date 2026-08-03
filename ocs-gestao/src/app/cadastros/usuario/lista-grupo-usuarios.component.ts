import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Rota } from "app/core/rota/rota";
import { RotaService } from "app/core/rota/rota.service";
import { AlertService } from "app/shared/components/alert/alert.service";
import { GrupoUsuarios } from "./grupo-usuarios";
import { GrupoUsuariosService } from "./grupo-usuarios.service";

declare var $:any

@Component({
    templateUrl:'lista-grupo-usuarios.component.html',
    styleUrls:[
        'lista-grupo-usuarios.component.css'
    ]
})
export class ListaGrupoUsuariosComponent implements OnInit{

    grupos_usuarios: GrupoUsuarios[];
    formGrupoUsuarios: FormGroup;
    idGrupoUsuarios:number;
    Rotas: Rota[];

    constructor(
        private grupoUsuariosService: GrupoUsuariosService,
        private alertService: AlertService,
        private router:Router,
        private formBuilder: FormBuilder,
        private rotaService: RotaService
    ){}

    ngOnInit(): void {
        this.idGrupoUsuarios = -1;
        this.formGrupoUsuarios = this.formBuilder.group({
            Nome:[null,Validators.required],
            Ativo:[true]
        })
        this.recuperaGruposUsuarios();
    }

    recuperaGruposUsuarios(){
        this.grupoUsuariosService.getAll()
        .subscribe({
            next: res =>{
                this.grupos_usuarios = res;
            },
            error: err =>{
                this.alertService.danger("Erro aor recuperar grupos de usuários")
                console.log(err);
            }
        })
    }

    editaGrupoUsuarios(dados:GrupoUsuarios){
        if (dados.ID == 1){
            return;
        }
        this.idGrupoUsuarios = dados.ID;
        this.formGrupoUsuarios.get('Nome').setValue(dados.Nome);
        this.formGrupoUsuarios.get('Ativo').setValue(dados.Ativo.data[0] == 1);
        this.exibeEdit();
        this.recuperaRotasGrupos(this.idGrupoUsuarios);
    }


    NovoGrupoUsuarios(){
        this.idGrupoUsuarios = -1;
        this.formGrupoUsuarios.get('Nome').setValue('');
        this.formGrupoUsuarios.get('Ativo').setValue(true);
        this.exibeEdit();
    }

    exibeEdit(){
        $('#btnNovo').hide()
        $('#listaGruposUsuarios').hide(200,()=>{
            $('#editGrupoUsuarios').show();
       })
    }

    cancelaEdit(){
        $('#btnNovo').show()
        $('#editGrupoUsuarios').hide(200,()=>{
            $('#listaGruposUsuarios').show();
       })       
    }

    salvaGrupoUsuarios(){
        if(this.formGrupoUsuarios.valid){
            let dados:GrupoUsuarios = this.formGrupoUsuarios.getRawValue() as GrupoUsuarios;
            dados.ID = this.idGrupoUsuarios;
            if(this.idGrupoUsuarios == -1){
                this.grupoUsuariosService.Insert(dados)
                .subscribe({
                    next: res =>{
                        this.alertService.success("Grupo salvo com sucesso");
                        this.cancelaEdit()
                        this.recuperaGruposUsuarios();
                    },
                    error: err =>{
                        console.log(err);
                        this.alertService.danger("Erro ao cadastrar grupo")
                    }
                })
            }
            else{
        
                this.grupoUsuariosService.Update(dados)
                .subscribe({
                    next: res =>{
                        this.alertService.success("Grupo atualizado com sucesso");
                        this.cancelaEdit();
                        this.recuperaGruposUsuarios();
                    },
                    error: err =>{
                        console.log(err);
                        this.alertService.danger("Erro ao atualizar grupo")
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
                this.recuperaRotasGrupos(this.idGrupoUsuarios)
            },
            error: err =>{
                this.alertService.danger("Erro ao recuperar dados de permissões");
                console.log(err);
            }
        })       
    }
}