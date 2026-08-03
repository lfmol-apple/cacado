import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TipoMovimentacao } from "app/cadastros/auxiliares/servicos/tipo-movimentacao";
import { TipoMovimentacaoService } from "app/cadastros/auxiliares/servicos/tipo-movimentacao.service";
import { AlertService } from "app/shared/components/alert/alert.service";
import { Movimentacao, TotalMovimentacao } from "./movimentacao";
import { MovimentacaoFiltro } from "./movimentacao-filtro";
import { MovimentacaoService } from "./movimentacao.service";

@Component({
    templateUrl: './lista-movimentacao.component.html',
    styleUrls:[
        'lista-movimentacao.component.css'
    ]
})
export class ListaMovimentacaoComponent implements OnInit{

    formFiltroMovimentacao: FormGroup;
    tipos_movimentacao: TipoMovimentacao[];
    Movimentacoes: Movimentacao[];
    Totais: TotalMovimentacao[];
    Credito: any;
    Debito: any;
    Total: any;

    panelOpenState = true;

    constructor(
        private formBuilder: FormBuilder,
        private movimentacaoService: MovimentacaoService,
        private tipoMovimentacaoService: TipoMovimentacaoService,
        private alertService: AlertService,
        private router: Router
    ){}

    ngOnInit(): void {
        this.formFiltroMovimentacao = this.formBuilder.group({
            PeriodoDe:[formatDate(new Date(),'yyyy-MM-dd','en'),Validators.required],
            PeriodoAte:[formatDate(new Date(),'yyyy-MM-dd','en'),Validators.required],
            IDTipo_Movimentacao: [""],
            Status: [""] 
          
        })
        this.recuperaTiposMovimentacao();
        this.filtraMovimentacoes();
    }

    recuperaTiposMovimentacao(){
        this.tipoMovimentacaoService.getAtivos()
        .subscribe({
            next: res =>{
                this.tipos_movimentacao = res;
            },
            error: err =>{
                console.log(err);
                this.alertService.danger("Erro ao recuperar tipos de movimentacao");
            }
        })
    }

    filtraMovimentacoes(){
        const filtros = this.formFiltroMovimentacao.getRawValue() as MovimentacaoFiltro;
        this.movimentacaoService.getbyFiltros(filtros)
        .subscribe({
            next: res =>{
                this.Movimentacoes = res.Movimentacoes;
                this.Totais = res.Totais;
                this.Debito = this.Totais.find(x => x.Tipo  == "Debito")?.Total;
                this.Credito = this.Totais.find(x => x.Tipo  == "Credito")?.Total;
                this.Total = parseFloat((this.Credito?this.Credito:0)) - parseFloat((this.Debito?this.Debito:0));
            },
            error: err =>{
                this.alertService.danger('Erro ao recuperar movimentações');
                console.log(err);
            }
        })

    }

    toggleConferido(ID:number){
        this.movimentacaoService.toggleConferido(ID)
        .subscribe({
            next: () =>{
                this.filtraMovimentacoes()
            },
            error: err =>{
                this.alertService.danger("Erro ao alterar status de conferência");
                console.log(err);
            }
        })
    }

    editaMovimentacao(ID){
        this.router.navigate(['/movimentacao',ID],{replaceUrl:true});  
    }
    novaMovimentacao(){
        this.router.navigate(['/movimentacao',-1],{replaceUrl:true});
    }
}