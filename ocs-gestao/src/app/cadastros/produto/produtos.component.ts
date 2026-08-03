import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Produto } from './produto';
import { ProdutoService } from './produto.service';
import { AlertService } from 'app/shared/components/alert/alert.service';
@Component({
    selector: 'produtos',
    templateUrl: './produtos.component.html'   ,
    styleUrls:['./produtos.component.css']
})
export class ProdutosComponent implements OnInit{

    Produtos :Produto[];
    
    constructor(
        private produtoService:ProdutoService,
        private alertService:AlertService,
        private router:Router
    ){}

    ngOnInit(): void {
        this.recuperaProdutos();
    }

    recuperaProdutos(){
        this.produtoService.getAll()
        .subscribe({
            next: res =>{
                this.Produtos = res;
            },
            error: err =>{
                console.log(err);
                this.alertService.danger("Erro ao recuperar produtos")
            }
        }
        )
    }

    editaProduto(ID: number){
        this.router.navigate(['/produto',ID],{replaceUrl:true});

    }

    novoProduto(){
        this.router.navigate(['/produto',-1],{replaceUrl:true});
    }
}