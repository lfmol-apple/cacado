import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router,ActivatedRoute } from "@angular/router";
import { Galpao } from "app/cadastros/galpao/galpao";
import { GalpaoService } from "app/cadastros/galpao/galpao.service";
import { AlertService } from "app/shared/components/alert/alert.service";
import { GalpaoMovimentacao } from "./galpao_movimentacao";
import { GalpaoMovimentacaoService } from "./lista-galpao_movimentacao.service";
import { UserService } from "app/core/user/user.service";


@Component({
    templateUrl:"./galpao-movimentacao.component.html",
    styleUrls:[
        "galpao-movimentacao.component.css"
    ]
})

export class GalpaoMovimentacaoComponent implements OnInit{

    idmovimentacao:number;
    formMovimentacao: FormGroup;
    galpoes: Galpao[];
    panelOpenState = true;
    movimentacao: GalpaoMovimentacao;
    constructor(
      private formBuilder: FormBuilder,
      private galpaoService:  GalpaoService,
      private alertService: AlertService,
      private route: ActivatedRoute,
      private router: Router  ,
      private movimentacaoService: GalpaoMovimentacaoService,
      private userService:UserService
    ){}


    ngOnInit(): void {

        this.formMovimentacao = this.formBuilder.group({
            Data:[formatDate(new Date(),'yyyy-MM-dd','en'), Validators.required],
            QtdOvos:[null,[Validators.required,Validators.min(0)]],
            QtdRacao:[null,[Validators.required,Validators.min(0)]],
            QtdMortes:[null,[Validators.required,Validators.min(0)]],
            IDGalpao:[null,Validators.required], 
        });

        this.recuperaGalpoes();
        this.recuperaMovimentacao();
    }

    recuperaMovimentacao(){
        this.idmovimentacao = this.route.snapshot.params.idmovimentacao;
        if (this.idmovimentacao > 0){
            this.movimentacaoService.get(this.idmovimentacao)
            .subscribe({
                next: res =>{
                    this.movimentacao = res;
                    this.formMovimentacao.patchValue({
                        Data: formatDate(this.movimentacao.Data,'yyyy-MM-dd','en'),
                        QtdOvos: this.movimentacao.QtdOvos,
                        QtdRacao: this.movimentacao.QtdRacao,
                        QtdMortes: this.movimentacao.QtdMortes,
                        IDGalpao: this.movimentacao.IDGalpao
                    })
                }
            })
        }
    }

    recuperaGalpoes(){
        this.galpaoService.getAtivos()
        .subscribe({
            next: res =>{
                this.galpoes = res;
            },
            error: err =>{
                this.alertService.danger("Erro ao recuperar galpões");
            }
        })
    }

    salvaMovimentacao(){
        if (this.formMovimentacao.valid){
            let dados = this.formMovimentacao.getRawValue() as GalpaoMovimentacao;
            dados.IDUsuCadastro = parseInt(this.userService.getUserID());
            if (this.idmovimentacao < 0){
                this.movimentacaoService.insert(dados)
                .subscribe({
                    next: res =>{
                        this.alertService.success("Movimentacao incluída com sucesso",true);
                        this.cancelar();
                    },
                    error:err =>{
                        console.error(err);
                        this.alertService.danger("Erro ao incluir movimentação")
                    }
                })
            }
            else{
                dados.ID = this.idmovimentacao;
                this.movimentacaoService.update(dados)
                .subscribe({
                    next: res =>{
                        this.alertService.success("Movimentacao atualizada com sucesso",true);
                        this.cancelar();
                    },
                    error:err =>{
                        console.error(err);
                        this.alertService.danger("Erro ao incluir movimentação")
                    }
                })               
            }
        }
        else{
            this.alertService.danger('Preencha todos os campos obrigatórios');
        }
    }
    excluirCompra(){
        if (confirm("Deseja realmente excluir a movimentação?")){
            this.movimentacaoService.delete(this.idmovimentacao)
            .subscribe({
                next: res=>{
                    this.alertService.success("Movimentacao excluída com sucesso", true);
                    this.cancelar();
                },
                error: err =>{
                    this.alertService.danger("Erro ao excluir movimentação");
                }
            })
        }
    }
    cancelar(){
        this.router.navigate(['/movgalpoes'],{replaceUrl:true})
    }
}