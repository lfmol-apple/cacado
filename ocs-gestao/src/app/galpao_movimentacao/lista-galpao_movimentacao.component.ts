import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GalpaoMovimentacaoService } from "./lista-galpao_movimentacao.service";
import { GalpaoService } from "app/cadastros/galpao/galpao.service";
import { AlertService } from "app/shared/components/alert/alert.service";
import { Galpao } from "app/cadastros/galpao/galpao";
import { formatDate } from "@angular/common";
import { DadosMovimentacao, GalpaoMovimentacao, TotaisMovimentacoes } from "./galpao_movimentacao";
import { GalpaoMovimentacaoFiltro } from "./galpao_movimentacao-filtro";
import { Router } from "@angular/router";
@Component({
    templateUrl:"./lista-galpao_movimentacao.component.html",
    styleUrls:[
        "lista-galpao_movimentacao.component.css"
    ]
})
export class ListaGalpaoMovimentacaoComponent implements OnInit{

    formFiltroMov : FormGroup;
    galpoes: Galpao[];
    movimentacoes: GalpaoMovimentacao[];
    panelOpenState = true;
    totais: TotaisMovimentacoes;


    constructor(
        private formBuilder:FormBuilder,
        private galpaoMovimentacaoService: GalpaoMovimentacaoService,
        private galpaoService: GalpaoService,
        private alertService:AlertService,
        private router:Router
    ){}

    ngOnInit(): void {
        
        this.formFiltroMov = this.formBuilder.group({
            PeriodoDe:[formatDate(new Date(),'yyyy-MM-dd','en'),Validators.required],
            PeriodoAte:[formatDate(new Date(),'yyyy-MM-dd','en'),Validators.required],
            Galpao:[-1]
        });

        this.recuperaGalpoes();
        this.filtraMovimentacoes();
    }

    recuperaGalpoes(){
        this.galpaoService.getAtivos()
        .subscribe({
            next: res =>{
                this.galpoes = res
            },
            error: err=>{
                this.alertService.danger("Erro ao recuperar galpões");
            }
        })
    }
    novaMovimentacao(){
        this.router.navigate(['/movgalpao',-1],{replaceUrl:true}); 
    }

    filtraMovimentacoes(){
        this.panelOpenState = false;
        let dados = this.formFiltroMov.getRawValue() as GalpaoMovimentacaoFiltro;
        this.galpaoMovimentacaoService.getByFiltros(dados)
        .subscribe({
            next: res =>{
                console.log(res);
                const dadosMovimentacao = res as DadosMovimentacao;
                this.movimentacoes = dadosMovimentacao.movimentacoes;
                this.totais = dadosMovimentacao.totais;
                console.log(res);
            },
            error: res =>{
                this.alertService.danger("Erro ao recuperar movimentações");
            }
        })
    }

    editaMov(id:number){
        this.router.navigate(['/movgalpao',id],{replaceUrl:true}); 
        
    }

    imprimir(){
        (window as any).print();
    }

}