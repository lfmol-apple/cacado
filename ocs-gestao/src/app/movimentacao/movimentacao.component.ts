import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TipoMovimentacao } from "app/cadastros/auxiliares/servicos/tipo-movimentacao";
import { TipoMovimentacaoService } from "app/cadastros/auxiliares/servicos/tipo-movimentacao.service";
import { AlertService } from "app/shared/components/alert/alert.service";
import { Movimentacao } from "./movimentacao";
import { MovimentacaoService } from "./movimentacao.service";

@Component({
    templateUrl: './movimentacao.component.html',
    styleUrls: [
        'lista-movimentacao.component.css'
    ]
})
export class MovimentacaoComponent implements OnInit{

    formMovimentacao: FormGroup;
    idMovimentacao:number;
    movimentacao: Movimentacao;
    tipos_movimentacao: TipoMovimentacao [];
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private movimentacaoService: MovimentacaoService,
        private tipoMovimentacaoService: TipoMovimentacaoService,
        private alertService: AlertService,
        private router: Router
    ){}

    ngOnInit(): void {
        this.formMovimentacao = this.formBuilder.group({
            DtCadastro:[formatDate(new Date(),'yyyy-MM-dd','en'),Validators.required],
            IDTipo_Movimentacao: [null, Validators.required],
            Observacoes:[null],
            Valor:[0,Validators.required]
        });

        this.recuperaTiposMovimentacao();
        this.recuperaMovimentacao();
    }
    recuperaTiposMovimentacao(){
        this.tipoMovimentacaoService.getAtivos()
        .subscribe({
            next: res =>{
                this.tipos_movimentacao = res;
            },
            error: err =>{
                console.log(err);
                this.alertService.danger("Erro ao recuperar tipos de movimentacao")
            }
        })
    }

    recuperaMovimentacao(){
        this.idMovimentacao = this.route.snapshot.params.idmovimentacao;
        if(this.idMovimentacao > 0){
            this.movimentacaoService.Get(this.idMovimentacao)
            .subscribe({
                next: res =>{
                    this.movimentacao = res;
                    this.formMovimentacao.patchValue({
                        Data: this.movimentacao.DtCadastro,
                        IDTipo_Movimentacao: this.movimentacao.IDTipo_Movimentacao,
                        Observacoes : this.movimentacao.Observacoes,
                        Valor: this.movimentacao.Valor
                    })
                },
                error: err =>{
                    this.alertService.danger('Erro ao recuperar dados da movimentacao');
                    console.log(err);
                }
            })
        }
    }

    salvaMovimentacao(){     
        if (this.formMovimentacao.valid)   {
            let dadosMovimentacao = this.formMovimentacao.getRawValue() as Movimentacao;
            dadosMovimentacao.ID = this.idMovimentacao;        
            if(this.idMovimentacao == -1){
                this.movimentacaoService.Insert(dadosMovimentacao)
                .subscribe({
                    next: res =>{
                        this.alertService.success('Movimentação salva com sucesso',true);
                        this.router.navigate(['/movimentacao',-1],{replaceUrl:true});
                    },
                    error: err=>{
                        this.alertService.danger("Erro ao salvar movimentacao");
                        console.log(err);
                    }
                })
            }
            else{
                this.movimentacaoService.Update(dadosMovimentacao)
                .subscribe({
                    next: res =>{
                        this.alertService.success('Movimentação atualizada com sucesso',true);
                        this.cancelar()
                    },
                    error: err=>{
                        this.alertService.danger("Erro ao salvar movimentacao");
                        console.log(err);
                    }
                })            
            }
        }
    }

    cancelar(){
        this.router.navigate(['/movimentacoes',{replaceUrl:true}])
    }
}