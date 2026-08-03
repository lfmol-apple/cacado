import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Insumo } from './insumo';
import { InsumoService } from './insumo.service';
import { AlertService } from 'app/shared/components/alert/alert.service';
@Component({
    selector: 'insumos',
    templateUrl: './insumos.component.html'   ,
    styleUrls:['./insumos.component.css']
})
export class InsumosComponent implements OnInit{

    Insumos :Insumo[];
    
    constructor(
        private insumoService:InsumoService,
        private alertService:AlertService,
        private router:Router
    ){}

    ngOnInit(): void {
        this.recuperaInsumos();
    }

    recuperaInsumos(){
        this.insumoService.getAll()
        .subscribe({
            next: res =>{
                this.Insumos = res;
            },
            error: err =>{
                console.log(err);
                this.alertService.danger("Erro ao recuperar insumos")
            }
        }
        )
    }

    editaInsumo(ID: number){
        this.router.navigate(['/insumo',ID],{replaceUrl:true});

    }

    novoInsumo(){
        this.router.navigate(['/insumo',-1],{replaceUrl:true});
    }
}