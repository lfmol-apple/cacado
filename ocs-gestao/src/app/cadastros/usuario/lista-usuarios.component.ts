import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "app/shared/components/alert/alert.service";
import { GrupoUsuarios } from "./grupo-usuarios";
import { GrupoUsuariosService } from "./grupo-usuarios.service";
import { Usuario } from "./usuario";
import { UsuarioService } from "./usuario.service";

@Component({
    templateUrl:'./lista-usuarios.component.html',
    styleUrls:[
        'lista-usuarios.component.css'
    ]
})
export class ListaUsuariosComponent implements OnInit{
    usuarios: Usuario[];
    formUsuario: FormGroup;
    grupos_usuario: GrupoUsuarios[];
    idUsuario: number;
    showSenhas:boolean = false;

    constructor(
        private usuarioService: UsuarioService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private grupoUsuariosService: GrupoUsuariosService
    ){}
    
    ngOnInit(): void {
        this.idUsuario = -1;
        this.formUsuario = this.formBuilder.group({
            Nome:[null,Validators.required],
            Login:[null,Validators.required],
            IDGrupo_Usuarios:[null,Validators.required],
            Senha:[null],
            ConfirmaSenha:[null],
            Ativo:[true]
        })
        this.recuperaUsuarios();
        this.recuperaGrupoUsuarios();
    }

    recuperaUsuarios(){
        this.usuarioService.getAll()
        .subscribe({
            next: res => {
                this.usuarios = res;
            },
            error: err =>{
                console.log(err);
                this.alertService.danger("Erro ao recuperar usuarios")
            }
        })
    }
    recuperaGrupoUsuarios(){
        this.grupoUsuariosService.GetAtivos()
        .subscribe({
            next: res => {
                this.grupos_usuario = res;
                console.log(this.grupos_usuario)
            },
            error: err =>{
                console.log(err);
                this.alertService.danger("Erro ao recuperar grupos de usuarios")
            }
        })
    }
    novoUsuario(){
        this.idUsuario = -1;
        this.formUsuario.get('Nome').setValue('');
        this.formUsuario.get('Login').setValue('');
        this.formUsuario.get('IDGrupo_Usuarios').setValue(null);
        this.formUsuario.get('Senha').setValue(null);
        this.formUsuario.get('ConfirmaSenha').setValue(null);
        this.formUsuario.get('Ativo').setValue(true);
        this.formUsuario.get('Senha').clearValidators();
        this.formUsuario.get('Senha').addValidators(Validators.required);
        this.formUsuario.get('ConfirmaSenha').clearValidators();
        this.formUsuario.get('ConfirmaSenha').addValidators(Validators.required);
        this.formUsuario.updateValueAndValidity()
        this.exibeEdit();
    }

    editaUsuario(dados){
        if (dados.ID == 1){
            return;
        }
        this.formUsuario.get('Senha').clearValidators();
        this.formUsuario.get('ConfirmaSenha').clearValidators();
        this.showSenhas = false;
        this.idUsuario = dados.ID;
        this.formUsuario.patchValue({
            Nome:dados.Nome,
            Login:dados.Login,
            IDGrupo_Usuarios:dados.IDGrupo_Usuarios,
            Senha: null,
            ConfirmaSenha: null,
            Ativo: dados.Ativo.data[0]== 1
        })
        this.exibeEdit();
    }

    salvaUsuario(){
        if(this.formUsuario.valid){

            let dados = this.formUsuario.getRawValue() as Usuario;
            dados.ID = this.idUsuario;
            if (this.idUsuario == -1){
                if(this.formUsuario.value.Senha != this.formUsuario.value.ConfirmaSenha){
                    this.alertService.danger("A senha e a confirmação não conferem");
                    return;
                }
                this.usuarioService.Insert(dados)
                .subscribe({
                    next: res =>{
                        this.alertService.success("Usuário cadastrado com sucesso");
                        this.cancelaEdit();
                        this.recuperaUsuarios();
                    },
                    error: err =>{
                        console.log(err);
                        this.alertService.danger("Erro ao cadastrar usuário");
                    }
                })
            }
            else{
                this.usuarioService.Update(dados)
                .subscribe({
                    next: res =>{
                        this.alertService.success("Usuário atualizado com sucesso");
                        this.cancelaEdit();
                        this.recuperaUsuarios();
                    },
                    error: err =>{
                        console.log(err);
                        this.alertService.danger("Erro ao atualizar usuário");
                    }
                })               
            }
        }
    }
    exibeEdit(){
        $('#btnNovo').hide()
        $('#listaUsuarios').hide(200,()=>{
            $('#editUsuarios').show();
       })
    }

    cancelaEdit(){
        $('#btnNovo').show()
        $('#editUsuarios').hide(200,()=>{
            $('#listaUsuarios').show();
       })       
    }

    habilitaAlterarSenha(){
        this.showSenhas = true;
        this.formUsuario.get('Senha').setValue(null);
        this.formUsuario.get('ConfirmaSenha').setValue(null);
    }

    alteraSenha(){
        if(this.formUsuario.value.Senha != this.formUsuario.value.ConfirmaSenha){
            this.alertService.danger("A senha e a confirmação não conferem");
            return;
        }
        this.usuarioService.AlteraSenha(this.idUsuario,this.formUsuario.value.Senha) 
        .subscribe({
            next: () =>{
                this.alertService.success("Senha alterada com sucesso");
                this.cancelaEdit()
            },
            error: err =>{
                this.alertService.danger("Erro ao alterar senha");
            }
        })      
    }
}