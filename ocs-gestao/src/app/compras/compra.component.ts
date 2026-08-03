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
import { Compra } from "./compra";
import { Insumo } from "app/cadastros/insumo/insumo";
import { InsumoService } from "app/cadastros/insumo/insumo.service";
import {CompraItem } from "./compra-item";
import { ActivatedRoute, Router } from "@angular/router";


declare var $: any;
@Component({
    templateUrl:"./compra.component.html",
    styleUrls:[
        "lista-compras.component.css"
    ]
})
export class CompraCompnent implements OnInit{
   
    idcompra:number;
    formCompra : FormGroup;
    formItens : FormGroup;
    FornecedoresFiltrados: Observable<Fornecedor[]>
    InsumosFiltrados: Observable<Insumo[]>
    tipos_Documento: TipoDocumento[];
    formas_Pagamento: FormaPagamento[];
    itens_Compra: CompraItem[] = [];
    totalCompra: number = 0;
    totalAReceber :number = 0;
    Compra:Compra;

    panelOpenState = true;
    filtoUsuarios: any[];
    constructor(
        private formBuilder: FormBuilder,
        private fornecedorService: FornecedorService,
        private tipoDocumentoService: TipoDocumentoService,
        private formaPagamentoService: FormaPagamentoService,
        private alertService: AlertService,
        private compraService:CompraService,
        private insumoService: InsumoService,
        private route: ActivatedRoute,
        private router: Router

    ){}


    ngOnInit(): void {
        this.itens_Compra = [];

        this.formCompra = this.formBuilder.group({
            Data:[formatDate(new Date(),'yyyy-MM-dd','en'),Validators.required],
            Fornecedor:['',Validators.required],
            IDTipo_Documento:[null],
            NumDocumento:[''],
            DataVencimento:[formatDate(new Date(),'yyyy-MM-dd','en')],
            DataPagamento:[null],
            IDForma_Pagamento:[null],
            ValorPago:[{value:0 ,disabled:true}],
            Obs:['']

        });


  
        this.FornecedoresFiltrados = this.formCompra.get('Fornecedor')
        .valueChanges
        .pipe(
            debounceTime(300),
            switchMap(value => this.fornecedorService.getAutocomplete(value))
        )


        this.formItens = this.formBuilder.group({
            Insumo:['',Validators.required],
            UnidadeMedida:[{value:null,disabled:true}],
            ValorUnitario:[0,Validators.required],
            Quantidade:[1,Validators.required],
            ValorTotal:[{value:0,disabled:true}],
        
        })

        this.InsumosFiltrados = this.formItens.get('Insumo')
        .valueChanges
        .pipe(
            debounceTime(300),
            switchMap(value => this.insumoService.getAutoComplete(value))
        )

        this.formItens.get('Insumo')
        .valueChanges
        .subscribe({
            next: value =>{
                 this.formItens.get('UnidadeMedida').setValue(`${value?.NomeUnidadeMedida} - ${value?.SiglaUnidadeMedida}`);
                 this.formItens.get('ValorUnitario').setValue(value?.Valor);
                 let quantidadeInsumo = this.formItens.value?.Quantidade?this.formItens.value.Quantidade:0;
                 let valor = value? value.Valor:0
                 this.calculaTotalInsumo(valor,quantidadeInsumo);
            }
        })

        this.formItens.get('ValorUnitario').valueChanges
        .subscribe({
            next: value => {
                let quantidadeInsumo = this.formItens.value.Quantidade?this.formItens.value.Quantidade:0;
                this.calculaTotalInsumo(value,quantidadeInsumo)
            }
        })

        this.formItens.get('Quantidade').valueChanges
        .subscribe({
            next: value => {
                    let valorInsumo = this.formItens.value.ValorUnitario?this.formItens.value.ValorUnitario:0;

                this.calculaTotalInsumo(valorInsumo,value)
            }
        })

        this.reuperaTipoDocumento();
        this.reuperaFormaPagamento();
        this.recuperaCompra();
    }



    recuperaCompra(){
        this.idcompra = this.route.snapshot.params.idcompra;
        if(this.idcompra > 0){
            this.compraService.Get(this.idcompra)
            .subscribe({
                next: res =>{
                    this.Compra = res;
                    this.formCompra.patchValue({
                        Data:  formatDate(this.Compra?.Data,'yyyy-MM-dd','en'),
                        Fornecedor: this.Compra?.Fornecedor,
                        IDTipo_Documento: this.Compra?.IDTipo_Documento,
                        NumDocumento: this.Compra?.NumDocumento,
                        DataVencimento : this.Compra?.DataVencimento? formatDate(this.Compra?.DataVencimento,'yyyy-MM-dd','en'):null,                   
                        DataPagamento : this.Compra?.DataPagamento? formatDate(this.Compra?.DataPagamento,'yyyy-MM-dd','en'):null,                   
                        ValorInsumos : this.Compra.ValorPago,
                        Obs: this.Compra.Obs
                    });

                    this.itens_Compra = this.Compra.Itens as CompraItem[];
                    this.calculaTotalCompra();
                },
                error: err =>{
                    console.log(err);
                    this.alertService.danger("Erro ao recuperar compra");
                }
            })
        }

    }

    calculaTotalInsumo(valorInsumo:number,quantidadeInsumo:number){
        this.formItens.get('ValorTotal').setValue(valorInsumo * quantidadeInsumo);

    }


    displayFornecedorFn(fornecedor: Fornecedor) {
        if (fornecedor) { return fornecedor.Nome; }
    }
    
    displayInsumoFn(insumo: Insumo) {
        if (insumo) { return insumo.Nome; }
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

    btnAdicionarClick(){
        $('#btnAdicionar').slideUp(200, ()=>{
            $('#panelAddItem').slideDown(200),()=>{
                $('#inputInsumo').focus();
            };
        });
    }

    btnCancelarItemClick(){
        $('#panelAddItem').slideUp(200, ()=>{
            $('#btnAdicionar').slideDown(200);
        });        
    }

    btnSalvaInsumoClick(){
        if(this.formItens.valid){
            if(this.formItens.value.Insumo.ID){

                let item :CompraItem = this.formItens.getRawValue() as CompraItem;
                item.ID = item.ID > 0? item.ID: new Date().getTime() * -1;
                item.NomeInsumo = this.formItens.value.Insumo?.Nome;
                item.IDInsumo =  this.formItens.value.Insumo?.ID;
                item.SiglaUnidadeMedida = this.formItens.value.Insumo?.SiglaUnidadeMedida;
                this.itens_Compra.push(item);
                this.calculaTotalCompra();
            }
            else{
                this.alertService.danger("Insumo inválido");

            }
            this.formItens.get('Insumo').setValue(null);
            this.formItens.get('ValorUnitario').setValue(0);
            this.formItens.get('Quantidade').setValue(1);
        }
    };

    calculaTotalCompra(){
        this.totalCompra = 0;
        this.itens_Compra.forEach(item =>{
            this.totalCompra += parseFloat(item.ValorTotal);
        });
        //this.Desconto = (this.formCompra.value.Desconto?this.formCompra.value.Desconto:0);
        this.totalAReceber = this.totalCompra ;
        if(this.totalAReceber < 0){this.totalAReceber = 0}
        this.formCompra.get('ValorPago').setValue(this.totalAReceber);
    }

    excluirItem(ID){
        if(confirm("Deseja realmente excluir o item?")){
            const index = this.itens_Compra.indexOf(this.itens_Compra.find(x => x.ID == ID));
            if (index >= 0){
                this.itens_Compra.splice(index,1);
                this.calculaTotalCompra();
            }
        }
    }
    salvaCompra(){
        if(this.formCompra.valid){
            if(this.itens_Compra?.length > 0){
                let dados = this.formCompra.getRawValue() as Compra;
                dados.IDFornecedor = this.formCompra.value.Fornecedor.ID;
                dados.Itens = this.itens_Compra;
                if(this.idcompra > 0){
                    dados.ID = this.idcompra;
                    this.compraService.Update(dados)
                    .subscribe({
                        next: res =>{
                            this.alertService.success("Compra atualizada com sucesso",true);
                            this.router.navigate(['/compras'],{replaceUrl:true});
                        },
                        error: err => {
                            console.log(err);
                            this.alertService.danger("Erro ao cadastrar compra");
                        }
                    })                   
                }
                else{
                    this.compraService.Insert(dados)
                    .subscribe({
                        next: res =>{
                            this.alertService.success("Compra cadastrada com sucesso",true);
                            this.router.navigate(['/compras'],{replaceUrl:true});
                        },
                        error: err => {
                            console.log(err);
                            this.alertService.danger("Erro ao cadastrar compra");
                        }
                    })
                }
            }
            else{
                this.alertService.danger("Informe pelo menos um item para compra")
            }
        }
        else{
            this.alertService.danger("Preencha os dados obrigatórios")
        }
    }

    cancelar(){
        this.router.navigate(['/compras'],{replaceUrl:true});
    }

    excluirCompra(){
        if (confirm("Deseja realmente excluir esta compra?\nEsta ação não pode ser desfeita")){
            this.compraService.Delete(this.idcompra)
            .subscribe({
                next: () =>{
                    this.alertService.success("Compra excluída com sucesso",true);
                    this.cancelar()
                },
                error: err =>{
                    this.alertService.danger("Compra ao excluir venda");
                    console.log(err);
                }
            })
        }
    }    
}