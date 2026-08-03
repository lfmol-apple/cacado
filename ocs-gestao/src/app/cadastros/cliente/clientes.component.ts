import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { AlertService } from 'app/shared/components/alert/alert.service';
@Component({
    selector: 'clientes',
    templateUrl: './clientes.component.html'   ,
    styleUrls:['./clientes.component.css']
})
export class ClientesComponent implements OnInit{

    Clientes :Cliente[];
    
    constructor(
        private clienteService: ClienteService,
        private alertService:AlertService,
        private router:Router
    ){}

    ngOnInit(): void {
        this.recuperaClientes();
    }

    recuperaClientes(){
        this.clienteService.getAll()
        .subscribe({
            next: res =>{
                this.Clientes = res;
            },
            error: err =>{
                console.log(err);
                this.alertService.danger("Erro ao recuperar clientes")
            }
        }
        )
    }

    editaCliente(ID: number){
        this.router.navigate(['/cliente',ID],{replaceUrl:true});

    }

    novoCliente(){
        this.router.navigate(['/cliente',-1],{replaceUrl:true});
    }
}