import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { AlertService } from 'app/shared/components/alert/alert.service';
import { ClienteValidators } from './cliente.validator.service';
import { ConsultaCnpjService } from 'app/core/utils/consulta-cnpj.service';
@Component({
    selector: 'cliente',
    templateUrl: './cliente.component.html'   ,
    styleUrls:['./clientes.component.css'],
    providers:[ClienteValidators]
})
export class ClienteComponent implements OnInit{

    formCliente: FormGroup;
    idCliente: number;
    cliente: Cliente;
    constructor(
        private formBuilder:FormBuilder,
        private route: ActivatedRoute,
        private clienteService: ClienteService,
        private router: Router,
        private alertService: AlertService,
        private clienteValidator: ClienteValidators,
        private consultaCnpjService:ConsultaCnpjService
    ){}

    ngOnInit(): void {
        this.formCliente = this.formBuilder.group({
            TipoPessoa: ['0',Validators.required],
            NumDoc:[''],
            Nome:['',Validators.required, this.clienteValidator.checkIfNomeExists(this.route.snapshot.params.idcliente)],
            RazaoSocial:[''],
            CEP:[''],
            Endereco:[''],
            Complemento:[''],
            Bairro:[''],
            Cidade:[''],
            UF:[''],
            Telefone:[''],
            Celular:[''],
            Whatsapp:["true"],
            Email:[''],
            NomeContato:[''],
            Obs:[''],
            Ativo:["true"]
        })
        this.recuperaCliente()
    }
    
    recuperaCliente(){
        this.idCliente = this.route.snapshot.params.idcliente;
        if (this.idCliente > 0){
            this.clienteService.Get(this.idCliente)
            .subscribe({
                next: res => {
                    this.cliente = res;
                    this.formCliente.patchValue({
                        TipoPessoa: this.cliente.TipoPessoa?.data[0].toString(),
                        NumDoc : this.cliente.NumDoc,
                        Nome :this.cliente.Nome,
                        RazaoSocial: this.cliente.RazaoSocial,
                        CEP: this.cliente.CEP,
                        Endereco: this.cliente.Endereco,
                        Complemento: this.cliente.Complemento,
                        Bairro: this.cliente.Bairro,
                        Cidade: this.cliente.Cidade,
                        UF: this.cliente.UF,
                        Telefone: this.cliente.Telefone,
                        Celular: this.cliente.Celular,
                        Whatsapp : this.cliente.Whatsapp?.data[0].toString() == '1',
                        Email :this.cliente.Email,
                        NomeContato: this.cliente.NomeContato,
                        Obs: this.cliente.Obs,
                        Ativo : this.cliente.Ativo?.data[0].toString() == '1'
                    })
                },
                error: err =>{
                    this.alertService.danger("Erro ao recuperar dados do cliente");
                    console.log(err);
                }
            })
        }
    }

    salvaCliente(){
        if(this.formCliente.valid && !this.formCliente.pending){
            const dadosCliente = this.formCliente.getRawValue() as Cliente;
            if(this.idCliente > 0){
                //UPDATE
                dadosCliente.ID = this.idCliente;
                this.clienteService.Update(dadosCliente)
                .subscribe({
                    next: () =>{
                        this.alertService.success("Cliente atualizado com sucesso",true);
                        this.router.navigate(['/clientes'],{replaceUrl:true});
                    },
                    error: err =>{
                        this.alertService.danger("Erro ao atualizar cliente");
                        console.log(err);
                    }
                })                
            }
            else{
                //INSERT
                this.clienteService.Insert(dadosCliente)
                .subscribe({
                    next: () =>{
                        this.alertService.success("Cliente cadastrado com sucesso",true);
                        this.router.navigate(['/clientes'],{replaceUrl:true});
                    },
                    error: err =>{
                        this.alertService.danger("Erro ao cadastrar cliente");
                        console.log(err);
                    }
                })
            }
        }
        else{
            this.alertService.danger("ERro");
            console.log(this.formCliente);
        }
    }

    cancelar(){
        this.router.navigate(['/clientes'],{replaceUrl:true});
    }


    consultaCnpj(){
        const cnpj = this.formCliente.value.NumDoc;
        if(cnpj){
            this.consultaCnpjService.Consulta(cnpj)
            .subscribe({
                next: res =>{
                    console.log(res);
                    let dados: any = res;
                    if (dados.status == 'ERROR'){
                        this.alertService.danger(dados.message);
                    }
                    else{
                        this.formCliente.patchValue({
                            Nome: dados.fantasia,
                            RazaoSocial: dados.nome,
                            Endereco: dados.logradouro +', ' + dados.numero,
                            Complemento: dados.complemento,
                            Bairro: dados.bairro,
                            Cidade:dados.municipio,
                            UF:dados.uf,
                            CEP: dados.cep?.replace('.','').replace('-','').replace(' ',''),
                            Telefone: dados.telefone?.replace('(','').replace('-','').replace(' ','').replace(')',''),
                            Email:dados.email,
                        })
                    }
                },
                error: err => {
                    console.log("Erro:",err);
                }
            })
        }
    }
}