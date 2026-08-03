import { Component, OnInit } from "@angular/core";
import { FormBuilder,FormGroup,Validators } from "@angular/forms";
import { Fornecedor } from "app/cadastros/fornecedores/fornecedor";
import { FornecedorService } from "app/cadastros/fornecedores/forncedor.service";
import { debounceTime, Observable,switchMap } from "rxjs";
import { formatDate } from "@angular/common";
import { TipoDocumento } from "app/cadastros/tipoDocumento/tipo-documento";
import { TipoDocumentoService } from "app/cadastros/tipoDocumento/tipo-documento.service";
import { AlertService } from "app/shared/components/alert/alert.service";
import { FormaPagamento } from "app/cadastros/formaPagamento/forma-pagamento";
import { FormaPagamentoService } from "app/cadastros/formaPagamento/forma-pagamento.service";
import { CompraService } from "./compra.service";
import { CompraFiltro } from "./compra-filtro";
import { Compra } from "./compra";
import {  Router } from "@angular/router";


@Component({
    selector:"lista-compras",
    templateUrl:"./lista-compras.component.html",
    styleUrls:[
        "lista-compras.component.css"
    ]
})
export class ListaComprasComponent implements OnInit{
   
    formFiltroCompras : FormGroup;
    FornecedoresFiltrados: Observable<Fornecedor[]>
    tipos_Documento: TipoDocumento[];
    formas_Pagamento: FormaPagamento[];
    Compras: Compra[];
    Total:number = 0;
    panelOpenState = true;
    filtoUsuarios: any[];
    constructor(
        private formBuilder: FormBuilder,
        private fornecedorService: FornecedorService,
        private tipoDocumentoService: TipoDocumentoService,
        private formaPagamentoService: FormaPagamentoService,
        private alertService: AlertService,
        private compraService:CompraService,
        private router:Router
    ){}


    ngOnInit(): void {
        console.log("Compras");


        this.formFiltroCompras = this.formBuilder.group({
            PeriodoDe:[formatDate(new Date(),'yyyy-MM-dd','en'),Validators.required],
            PeriodoAte:[formatDate(new Date(),'yyyy-MM-dd','en'),Validators.required],
            Fornecedor:[''],
            IDTipo_Documento:[''],
            NumDocumento:[''],
            PeriodoDeVencimento:[''],
            PeriodoAteVencimento:[''],
            StatusPagamento:[''],
            PeriodoDePagamento:[{value:null,disabled:true}],
            PeriodoAtePagamento:[{value:null,disabled:true}],
            IDFormaPagamento:[{value:null,disabled:true}]

        });

        this.FornecedoresFiltrados = this.formFiltroCompras.get('Fornecedor')
        .valueChanges
        .pipe(
            debounceTime(300),
            switchMap(value => this.fornecedorService.getAutocomplete(value))
        )

        this.formFiltroCompras.get('StatusPagamento')
        .valueChanges
        .subscribe({
            next: value => this.disableFieldsPagamento(value)
        })


        this.reuperaTipoDocumento();
        this.reuperaFormaPagamento();

        this.filtrarCompras();
    }

    disableFieldsPagamento(value){
        if (value != 'pago'){
            this.formFiltroCompras.controls["PeriodoDePagamento"].disable();
            this.formFiltroCompras.controls["PeriodoAtePagamento"].disable();
            this.formFiltroCompras.controls["IDFormaPagamento"].disable();
            this.formFiltroCompras.controls["PeriodoDePagamento"].setValue(null);
            this.formFiltroCompras.controls["PeriodoAtePagamento"].setValue(null);
            this.formFiltroCompras.controls["IDFormaPagamento"].setValue(null);
        }
        else{
            this.formFiltroCompras.controls["PeriodoDePagamento"].enable();
            this.formFiltroCompras.controls["PeriodoAtePagamento"].enable();
            this.formFiltroCompras.controls["IDFormaPagamento"].enable();
        }
    }


    displayFornecedorFn(fornecedor: Fornecedor) {
        if (fornecedor) { return fornecedor.Nome; }
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

    filtrarCompras(){
        if(this.formFiltroCompras.valid){
            this.panelOpenState =  !this.panelOpenState;
            let dados = this.formFiltroCompras.getRawValue() as CompraFiltro
            dados.IDFornecedor = this.formFiltroCompras.value.Fornecedor?.ID;
            this.compraService.getbyFiltros(dados)
            .subscribe({
                next: res =>{
                    console.log(res);
                    this.Compras =res?.Compras;
                    this.Total = res?.Total;
                },
                error:err =>{
                    this.alertService.danger("Erro ao recuperar compras");
                }
            })
        }
    }
    editaCompra(ID:number){
        this.router.navigate(['/compra',ID],{replaceUrl:true});
    }
    novaCompra(){
        this.router.navigate(['/compra',-1],{replaceUrl:true});
    }
}