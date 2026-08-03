import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Produto } from './produto';
import { ProdutoService } from './produto.service';
import { AlertService } from 'app/shared/components/alert/alert.service';
import { ProdutoValidators } from './produto.validator.service';
import { UnidadeMedidaService } from '../unidadeMedida/unidadeMedida.service';
import { UnidadeMedida } from '../unidadeMedida/unidadeMedida';

@Component({
    selector: 'produto',
    templateUrl: './produto.component.html'   ,
    styleUrls:['./produtos.component.css'],
    providers:[ProdutoValidators]
})
export class ProdutoComponent implements OnInit{

    formProduto: FormGroup;
    idProduto: number;
    produto: Produto;
    unidades_medida:UnidadeMedida[];
    constructor(
        private formBuilder:FormBuilder,
        private route: ActivatedRoute,
        private produtoService: ProdutoService,
        private router: Router,
        private alertService: AlertService,
        private produtoValidators: ProdutoValidators,
        private unidadeMedidaService: UnidadeMedidaService
    ){}

    ngOnInit(): void {
        this.formProduto = this.formBuilder.group({
            //ID, Nome, Descricao, IDUnidade_Medida, CodigoBarras, Valor, DtCadastro, IDUsuCadastro, Ativo
            Nome:['',Validators.required, this.produtoValidators.checkIfNomeExists(this.route.snapshot.params.idproduto)],
            Descricao:[''],
            IDUnidade_Medida:['',Validators.required],
            Valor:[0,Validators.required],
            Ativo:["true"]
        })

        this.unidadeMedidaService.getAll()
        .subscribe({
            next: res =>{
                this.unidades_medida = res;
                this.recuperaProduto()
            },
            error: err =>{
                console.log(err);
                this.alertService.danger("Erro ao recuperar unidades de medida");
            }
        })

    }
    
    recuperaProduto(){
        this.idProduto = this.route.snapshot.params.idproduto;
        if (this.idProduto > 0){
            this.produtoService.Get(this.idProduto)
            .subscribe({
                next: res => {
                    this.produto = res;
                    this.formProduto.patchValue({
                        Nome: this.produto.Nome,
                        Descricao:this.produto.Descricao,
                        IDUnidade_Medida:this.produto.IDUnidade_Medida,
                        Valor:this.produto.Valor,
                        Ativo : this.produto.Ativo.data[0].toString() == '1'
                    })
                },
                error: err =>{
                    this.alertService.danger("Erro ao recuperar dados do produto");
                    console.log(err);
                }
            })
        }
    }

    salvaProduto(){
        if(this.formProduto.valid){
            const dadosProduto = this.formProduto.getRawValue() as Produto;
            if(this.idProduto > 0){
                //UPDATE
                dadosProduto.ID = this.idProduto;
                this.produtoService.Update(dadosProduto)
                .subscribe({
                    next: () =>{
                        this.alertService.success("Produto atualizado com sucesso",true);
                        this.router.navigate(['/produtos'],{replaceUrl:true});
                    },
                    error: err =>{
                        this.alertService.danger("Erro ao atualizar produto");
                        console.log(err);
                    }
                })                
            }
            else{
                //INSERT
                this.produtoService.Insert(dadosProduto)
                .subscribe({
                    next: () =>{
                        this.alertService.success("Produto cadastrado com sucesso",true);
                        this.router.navigate(['/produtos'],{replaceUrl:true});
                    },
                    error: err =>{
                        this.alertService.danger("Erro ao cadastrar produto");
                        console.log(err);
                    }
                })
            }
        }
        else{
            console.log(this.formProduto)
        }
    }

    cancelar(){
        this.router.navigate(['/produtos'],{replaceUrl:true});
    }
}