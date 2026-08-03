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
import { Venda } from "./venda";
import { ProdutoService } from "app/cadastros/produto/produto.service";
import { Produto } from "app/cadastros/produto/produto";
import { VendaItem } from "./venda-item";
import { ActivatedRoute, Router } from "@angular/router";


declare var $: any;
@Component({
    templateUrl:"./venda.component.html",
    styleUrls:[
        "lista-vendas.component.css"
    ]
})
export class VendaCompnent implements OnInit{
   
    idvenda:number;
    formVenda : FormGroup;
    formItens : FormGroup;
    ClientesFiltrados: Observable<Cliente[]>
    ProdutosFiltrados: Observable<Produto[]>
    tipos_Documento: TipoDocumento[];
    formas_Pagamento: FormaPagamento[];
    itens_Venda: VendaItem[] = [];
    totalVenda: number = 0;
    Desconto: number = 0;
    totalAReceber :number = 0;
    Venda:Venda;

    panelOpenState = true;
    filtoUsuarios: any[];
    constructor(
        private formBuilder: FormBuilder,
        private clienteService: ClienteService,
        private tipoDocumentoService: TipoDocumentoService,
        private formaPagamentoService: FormaPagamentoService,
        private alertService: AlertService,
        private vendaService:VendaService,
        private produtoService: ProdutoService,
        private route: ActivatedRoute,
        private router: Router

    ){}


    ngOnInit(): void {
        this.itens_Venda = [];

        this.formVenda = this.formBuilder.group({
            Data:[formatDate(new Date(),'yyyy-MM-dd','en'),Validators.required],
            Cliente:['',Validators.required],
            IDTipo_Documento:[null],
            NumDocumento:[''],
            DataVencimento:[formatDate(new Date(),'yyyy-MM-dd','en')],
            DataPagamento:[null],
            IDForma_Pagamento:[null],
            ValorProdutos:[{value:0 ,disabled:true}],
            Desconto:[0],
            ValorPago:[{value:0 ,disabled:true}],
            Obs:['']

        });


        this.formVenda.get('Desconto').valueChanges
        .subscribe({
            next: value => {
                this.Desconto = value;
                this.calculaTotalVenda();
            }
        })

        this.ClientesFiltrados = this.formVenda.get('Cliente')
        .valueChanges
        .pipe(
            debounceTime(300),
            switchMap(value => this.clienteService.getAutocomplete(value))
        )


        this.formItens = this.formBuilder.group({
            Produto:['',Validators.required],
            UnidadeMedida:[{value:null,disabled:true}],
            ValorUnitario:[0,Validators.required],
            Quantidade:[1,Validators.required],
            ValorTotal:[{value:0,disabled:true}],
        
        })

        this.ProdutosFiltrados = this.formItens.get('Produto')
        .valueChanges
        .pipe(
            debounceTime(300),
            switchMap(value => this.produtoService.getAutoComplete(value))
        )

        this.formItens.get('Produto')
        .valueChanges
        .subscribe({
            next: value =>{
                 this.formItens.get('UnidadeMedida').setValue(`${value?.NomeUnidadeMedida} - ${value?.SiglaUnidadeMedida}`);
                 this.formItens.get('ValorUnitario').setValue(value?.Valor);
                 let quantidadeProduto = this.formItens.value?.Quantidade?this.formItens.value.Quantidade:0;
                 let valor = value? value.Valor:0
                 this.calculaTotalProduto(valor,quantidadeProduto);
            }
        })

        this.formItens.get('ValorUnitario').valueChanges
        .subscribe({
            next: value => {
                let quantidadeProduto = this.formItens.value.Quantidade?this.formItens.value.Quantidade:0;
                this.calculaTotalProduto(value,quantidadeProduto)
            }
        })

        this.formItens.get('Quantidade').valueChanges
        .subscribe({
            next: value => {
                    let valorProduto = this.formItens.value.ValorUnitario?this.formItens.value.ValorUnitario:0;

                this.calculaTotalProduto(valorProduto,value)
            }
        })

        this.reuperaTipoDocumento();
        this.reuperaFormaPagamento();
        this.recuperaVenda();
    }



    recuperaVenda(){
        this.idvenda = this.route.snapshot.params.idvenda;
        if(this.idvenda > 0){
            this.vendaService.Get(this.idvenda)
            .subscribe({
                next: res =>{
                    this.Venda = res;
                    this.formVenda.patchValue({
                        Data:  formatDate(this.Venda?.Data,'yyyy-MM-dd','en'),
                        Cliente: this.Venda?.Cliente,
                        IDTipo_Documento: this.Venda?.IDTipo_Documento,
                        NumDocumento: this.Venda?.NumDocumento,
                        DataVencimento : this.Venda?.DataVencimento? formatDate(this.Venda?.DataVencimento,'yyyy-MM-dd','en'):null,                   
                        DataPagamento : this.Venda?.DataPagamento? formatDate(this.Venda?.DataPagamento,'yyyy-MM-dd','en'):null,                   
                        ValorProdutos : this.Venda.ValorPago,
                        Obs: this.Venda.Obs
                    });

                    this.itens_Venda = this.Venda.Itens as VendaItem[];
                    this.calculaTotalVenda();
                },
                error: err =>{
                    console.log(err);
                    this.alertService.danger("Erro ao recuperar venda");
                }
            })
        }

    }

    calculaTotalProduto(valorProduto:number,quantidadeProduto:number){
        this.formItens.get('ValorTotal').setValue(valorProduto * quantidadeProduto);

    }


    displayClienteFn(cliente: Cliente) {
        if (cliente) { return cliente.Nome; }
    }
    
    displayProdutoFn(produto: Produto) {
        if (produto) { return produto.Nome; }
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
                $('#inputProduto').focus();
            };
        });
    }

    btnCancelarItemClick(){
        $('#panelAddItem').slideUp(200, ()=>{
            $('#btnAdicionar').slideDown(200);
        });        
    }

    btnSalvaProdutoClick(){
        if(this.formItens.valid){
            if(this.formItens.value.Produto.ID){

                let item :VendaItem = this.formItens.getRawValue() as VendaItem;
                item.ID = item.ID > 0? item.ID: new Date().getTime() * -1;
                item.NomeProduto = this.formItens.value.Produto?.Nome;
                item.IDProduto =  this.formItens.value.Produto?.ID;
                item.SiglaUnidadeMedida = this.formItens.value.Produto?.SiglaUnidadeMedida;
                this.itens_Venda.push(item);
                this.calculaTotalVenda();
            }
            else{
                this.alertService.danger("Produto inválido");

            }
            this.formItens.get('Produto').setValue(null);
            this.formItens.get('ValorUnitario').setValue(0);
            this.formItens.get('Quantidade').setValue(1);
        }
    };

    calculaTotalVenda(){
        this.totalVenda = 0;
        this.itens_Venda.forEach(item =>{
            this.totalVenda += parseFloat(item.ValorTotal);
        });
        //this.Desconto = (this.formVenda.value.Desconto?this.formVenda.value.Desconto:0);
        this.totalAReceber = this.totalVenda - this.Desconto;
        if(this.totalAReceber < 0){this.totalAReceber = 0}
        this.formVenda.get('ValorProdutos').setValue(this.totalVenda);
        this.formVenda.get('ValorPago').setValue(this.totalAReceber);
    }

    excluirItem(ID){
        if(confirm("Deseja realmente excluir o item?")){
            const index = this.itens_Venda.indexOf(this.itens_Venda.find(x => x.ID == ID));
            if (index >= 0){
                this.itens_Venda.splice(index,1);
                this.calculaTotalVenda();
            }
        }
    }
    salvaVenda(){
        if(this.formVenda.valid){
            if(this.itens_Venda?.length > 0){
                let dados = this.formVenda.getRawValue() as Venda;
                dados.IDCliente = this.formVenda.value.Cliente.ID;
                dados.Itens = this.itens_Venda;
                if(this.idvenda > 0){
                    dados.ID = this.idvenda;
                    this.vendaService.Update(dados)
                    .subscribe({
                        next: res =>{
                            this.alertService.success("Venda atualizada com sucesso",true);
                            this.router.navigate(['/vendas'],{replaceUrl:true});
                        },
                        error: err => {
                            console.log(err);
                            this.alertService.danger("Erro ao cadastrar venda");
                        }
                    })                   
                }
                else{
                    this.vendaService.Insert(dados)
                    .subscribe({
                        next: res =>{
                            this.alertService.success("Venda cadastrada com sucesso",true);
                            this.router.navigate(['/vendas'],{replaceUrl:true});
                        },
                        error: err => {
                            this.alertService.danger("Erro ao cadastrar venda");
                        }
                    })
                }
            }
            else{
                this.alertService.danger("Informe pelo menos um item para venda")
            }
        }
        else{
            this.alertService.danger("Preencha os dados obrigatórios")
        }
    }

    cancelar(){
        this.router.navigate(['/vendas'],{replaceUrl:true});
    }

    excluirVenda(){
        if (confirm("Deseja realmente excluir esta venda?\nEsta ação não pode ser desfeita")){
            this.vendaService.Delete(this.idvenda)
            .subscribe({
                next: () =>{
                    this.alertService.success("Venda excluída com sucesso",true);
                    this.cancelar()
                },
                error: err =>{
                    this.alertService.danger("Erro ao excluir venda");
                    console.log(err);
                }
            })
        }
    }
}