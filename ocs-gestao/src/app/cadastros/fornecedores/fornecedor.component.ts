import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Fornecedor } from './fornecedor';
import { FornecedorService } from './forncedor.service';
import { AlertService } from 'app/shared/components/alert/alert.service';
import { FornecedorValidators } from './fornecedor.validators.service';
import { ConsultaCnpjService } from 'app/core/utils/consulta-cnpj.service';

@Component({
    selector: 'fornecedor',
    templateUrl: './fornecedor.component.html'   ,
    styleUrls:['./fornecedores.component.css'],
    providers:[FornecedorValidators]
})
export class FornecedorComponent implements OnInit{

    formFornecedor: FormGroup;
    idFornecedor: number;
    fornecedor: Fornecedor;
    constructor(
        private formBuilder:FormBuilder,
        private route: ActivatedRoute,
        private fornecedorServide: FornecedorService,
        private router: Router,
        private alertService: AlertService,
        private forncededorValidator: FornecedorValidators,
        private consultaCnpjService: ConsultaCnpjService
    ){}

    ngOnInit(): void {
        this.formFornecedor = this.formBuilder.group({
            TipoPessoa: ['0',Validators.required],
            NumDoc:[''],
            Nome:['',Validators.required, this.forncededorValidator.checkIfNomeExists(this.route.snapshot.params.idfornecedor)],
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
        this.recuperaFornecedor()
    }
    
    recuperaFornecedor(){
        this.idFornecedor = this.route.snapshot.params.idfornecedor;
        if (this.idFornecedor > 0){
            this.fornecedorServide.Get(this.idFornecedor)
            .subscribe({
                next: res => {
                    this.fornecedor = res;
                    this.formFornecedor.patchValue({
                        TipoPessoa: this.fornecedor.TipoPessoa.data[0].toString(),
                        NumDoc : this.fornecedor.NumDoc,
                        Nome :this.fornecedor.Nome,
                        RazaoSocial: this.fornecedor.RazaoSocial,
                        CEP: this.fornecedor.CEP,
                        Endereco: this.fornecedor.Endereco,
                        Complemento: this.fornecedor.Complemento,
                        Bairro: this.fornecedor.Bairro,
                        Cidade: this.fornecedor.Cidade,
                        UD: this.fornecedor.UF,
                        Telefone: this.fornecedor.Telefone,
                        Celular: this.fornecedor.Celular,
                        Whatsapp : this.fornecedor.Whatsapp.data[0].toString() == '1',
                        Email :this.fornecedor.Email,
                        NomeContato: this.fornecedor.NomeContato,
                        Obs: this.fornecedor.Obs,
                        Ativo : this.fornecedor.Ativo.data[0].toString() == '1'
                    })
                },
                error: err =>{
                    this.alertService.danger("Erro ao recuperar dados do fornecedor");
                    console.log(err);
                }
            })
        }
    }

    salvaFornecedor(){
        if(this.formFornecedor.valid){
            const dadosFornecedor = this.formFornecedor.getRawValue() as Fornecedor;
            if(this.idFornecedor > 0){
                //UPDATE
                dadosFornecedor.ID = this.idFornecedor;
                this.fornecedorServide.Update(dadosFornecedor)
                .subscribe({
                    next: () =>{
                        this.alertService.success("Fornecedor atualizado com sucesso",true);
                        this.router.navigate(['/fornecedores'],{replaceUrl:true});
                    },
                    error: err =>{
                        this.alertService.danger("Erro ao atualizar fornecedor");
                        console.log(err);
                    }
                })                
            }
            else{
                //INSERT
                this.fornecedorServide.Insert(dadosFornecedor)
                .subscribe({
                    next: () =>{
                        this.alertService.success("Fornecedor cadastrado com sucesso",true);
                        this.router.navigate(['/fornecedores'],{replaceUrl:true});
                    },
                    error: err =>{
                        this.alertService.danger("Erro ao cadastrar fornecedor");
                        console.log(err);
                    }
                })
            }
        }
        else{
            console.log(this.formFornecedor)
        }
    }

    consultaCnpj(){
        const cnpj = this.formFornecedor.value.NumDoc;
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
                        this.formFornecedor.patchValue({
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
    cancelar(){
        this.router.navigate(['/fornecedores'],{replaceUrl:true});
    }
}