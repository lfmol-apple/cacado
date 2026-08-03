import { Component, OnInit } from "@angular/core";
import { FormBuilder,FormGroup,Validators } from "@angular/forms";
import { Cliente } from "app/cadastros/cliente/cliente";
import { ClienteService } from "app/cadastros/cliente/cliente.service";
import { debounceTime, Observable,switchMap } from "rxjs";
import { formatDate } from "@angular/common";
import { TipoDocumento } from "app/cadastros/tipoDocumento/tipo-documento";
import { TipoDocumentoService } from "app/cadastros/tipoDocumento/tipo-documento.service";
import { AlertService } from "app/shared/components/alert/alert.service";
import { FormaPagamento } from "app/cadastros/formaPagamento/forma-pagamento";
import { FormaPagamentoService } from "app/cadastros/formaPagamento/forma-pagamento.service";
import { VendaService } from "./venda.service";
import { VendaFiltro } from "./venda-filtro";
import { Venda } from "./venda";
import {  Router } from "@angular/router";


@Component({
    selector:"lista-vendas",
    templateUrl:"./lista-vendas.component.html",
    styleUrls:[
        "lista-vendas.component.css"
    ]
})
export class ListaVendasComponent implements OnInit{
   
    formFiltroVendas : FormGroup;
    ClientesFiltrados: Observable<Cliente[]>
    tipos_Documento: TipoDocumento[];
    formas_Pagamento: FormaPagamento[];
    Vendas: Venda[];
    Total: number = 0;

    panelOpenState = true;
    filtoUsuarios: any[];
    constructor(
        private formBuilder: FormBuilder,
        private clienteService: ClienteService,
        private tipoDocumentoService: TipoDocumentoService,
        private formaPagamentoService: FormaPagamentoService,
        private alertService: AlertService,
        private vendaService:VendaService,
        private router:Router
    ){}


    ngOnInit(): void {
        this.formFiltroVendas = this.formBuilder.group({
            PeriodoDe:[formatDate(new Date(),'yyyy-MM-dd','en'),Validators.required],
            PeriodoAte:[formatDate(new Date(),'yyyy-MM-dd','en'),Validators.required],
            Cliente:[''],
            IDTipo_Documento:[''],
            NumDocumento:[''],
            PeriodoDeVencimento:[''],
            PeriodoAteVencimento:[''],
            StatusPagamento:[''],
            PeriodoDePagamento:[{value:null,disabled:true}],
            PeriodoAtePagamento:[{value:null,disabled:true}],
            IDFormaPagamento:[{value:null,disabled:true}]

        });

        this.ClientesFiltrados = this.formFiltroVendas.get('Cliente')
        .valueChanges
        .pipe(
            debounceTime(300),
            switchMap(value => this.clienteService.getAutocomplete(value))
        )

        this.formFiltroVendas.get('StatusPagamento')
        .valueChanges
        .subscribe({
            next: value => this.disableFieldsPagamento(value)
        })


        this.reuperaTipoDocumento();
        this.reuperaFormaPagamento();

        this.filtrarVendas();
    }

    disableFieldsPagamento(value){
        if (value != 'pago'){
            this.formFiltroVendas.controls["PeriodoDePagamento"].disable();
            this.formFiltroVendas.controls["PeriodoAtePagamento"].disable();
            this.formFiltroVendas.controls["IDFormaPagamento"].disable();
            this.formFiltroVendas.controls["PeriodoDePagamento"].setValue(null);
            this.formFiltroVendas.controls["PeriodoAtePagamento"].setValue(null);
            this.formFiltroVendas.controls["IDFormaPagamento"].setValue(null);
        }
        else{
            this.formFiltroVendas.controls["PeriodoDePagamento"].enable();
            this.formFiltroVendas.controls["PeriodoAtePagamento"].enable();
            this.formFiltroVendas.controls["IDFormaPagamento"].enable();
        }
    }


    displayClienteFn(cliente: Cliente) {
        if (cliente) { return cliente.Nome; }
    }
    

    reuperaTipoDocumento(){
        this.tipoDocumentoService.getAll()
        .subscribe({
            next: res =>{
                this.tipos_Documento = res;
            },
            error: err =>{
                this.alertService.danger("Erro ao recuperar tipos de documento");
            }
        })
    }

    reuperaFormaPagamento(){
        this.formaPagamentoService.getAll()
        .subscribe({
            next: res =>{
                this.formas_Pagamento = res;
            },
            error: err =>{
                this.alertService.danger("Erro ao recuperar formas de pagamento");
            }
        })
    }

    filtrarVendas(){
        if(this.formFiltroVendas.valid){
            this.panelOpenState =  !this.panelOpenState;
            let dados = this.formFiltroVendas.getRawValue() as VendaFiltro
            dados.IDCliente = this.formFiltroVendas.value.Cliente?.ID;
            this.vendaService.getbyFiltros(dados)
            .subscribe({
                next: res =>{
                    this.Vendas = res?.Vendas;
                    this.Total  = res?.Total;
                },
                error:err =>{
                    this.alertService.danger("Erro ao recuperar vendas");
                }
            })
        }
    }
    editaVenda(ID:number){
        this.router.navigate(['/venda',ID],{replaceUrl:true});
    }
    novaVenda(){
        this.router.navigate(['/venda',-1],{replaceUrl:true});
    }
}