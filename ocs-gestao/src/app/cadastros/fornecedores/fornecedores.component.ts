import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fornecedor } from './fornecedor';
import { FornecedorService } from './forncedor.service';
import { AlertService } from 'app/shared/components/alert/alert.service';
@Component({
    selector: 'fornecedores',
    templateUrl: './fornecedores.component.html'   ,
    styleUrls:['./fornecedores.component.css']
})
export class FornecedoresComponent implements OnInit{

    Fornecedores :Fornecedor[];
    
    constructor(
        private fornecedorService:FornecedorService,
        private alertService:AlertService,
        private router:Router
    ){}

    ngOnInit(): void {
        this.recuperaFornecedores();
    }

    recuperaFornecedores(){
        this.fornecedorService.getAll()
        .subscribe({
            next: res =>{
                this.Fornecedores = res;
            },
            error: err =>{
                console.log(err);
                this.alertService.danger("Erro ao recuperar fornecedores")
            }
        }
        )
    }

    editaFornecedor(ID: number){
        this.router.navigate(['/fornecedor',ID],{replaceUrl:true});

    }

    novoFornecedor(){
        this.router.navigate(['/fornecedor',-1],{replaceUrl:true});
    }
}