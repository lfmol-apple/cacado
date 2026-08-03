import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Insumo } from './insumo';
import { InsumoService } from './insumo.service';
import { AlertService } from 'app/shared/components/alert/alert.service';
import { InsumoValidators } from './insumo.validator.service';
import { UnidadeMedidaService } from '../unidadeMedida/unidadeMedida.service';
import { UnidadeMedida } from '../unidadeMedida/unidadeMedida';

@Component({
    selector: 'insumo',
    templateUrl: './insumo.component.html'   ,
    styleUrls:['./insumos.component.css'],
    providers:[InsumoValidators]
})
export class InsumoComponent implements OnInit{

    formInsumo: FormGroup;
    idInsumo: number;
    insumo: Insumo;
    unidades_medida:UnidadeMedida[];
    constructor(
        private formBuilder:FormBuilder,
        private route: ActivatedRoute,
        private insumoService: InsumoService,
        private router: Router,
        private alertService: AlertService,
        private insumoValidators: InsumoValidators,
        private unidadeMedidaService: UnidadeMedidaService
    ){}

    ngOnInit(): void {
        this.formInsumo = this.formBuilder.group({
            //ID, Nome, Descricao, IDUnidade_Medida, CodigoBarras, Valor, DtCadastro, IDUsuCadastro, Ativo
            Nome:['',Validators.required, this.insumoValidators.checkIfNomeExists(this.route.snapshot.params.idinsumo)],
            Descricao:[''],
            IDUnidade_Medida:['',Validators.required],
            Valor:[0,Validators.required],
            Ativo:["true"]
        })

        this.unidadeMedidaService.getAll()
        .subscribe({
            next: res =>{
                this.unidades_medida = res;
                this.recuperaInsumo()
            },
            error: err =>{
                console.log(err);
                this.alertService.danger("Erro ao recuperar unidades de medida");
            }
        })

    }
    
    recuperaInsumo(){
        this.idInsumo = this.route.snapshot.params.idinsumo;
        if (this.idInsumo > 0){
            this.insumoService.Get(this.idInsumo)
            .subscribe({
                next: res => {
                    this.insumo = res;
                    this.formInsumo.patchValue({
                        Nome: this.insumo.Nome,
                        Descricao:this.insumo.Descricao,
                        IDUnidade_Medida:this.insumo.IDUnidade_Medida,
                        Ativo : this.insumo.Ativo.data[0].toString() == '1'
                    })
                },
                error: err =>{
                    this.alertService.danger("Erro ao recuperar dados do insumo");
                    console.log(err);
                }
            })
        }
    }

    salvaInsumo(){
        if(this.formInsumo.valid){
            const dadosInsumo = this.formInsumo.getRawValue() as Insumo;
            if(this.idInsumo > 0){
                //UPDATE
                dadosInsumo.ID = this.idInsumo;
                this.insumoService.Update(dadosInsumo)
                .subscribe({
                    next: () =>{
                        this.alertService.success("Insumo atualizado com sucesso",true);
                        this.router.navigate(['/insumos'],{replaceUrl:true});
                    },
                    error: err =>{
                        this.alertService.danger("Erro ao atualizar insumo");
                        console.log(err);
                    }
                })                
            }
            else{
                //INSERT
                this.insumoService.Insert(dadosInsumo)
                .subscribe({
                    next: () =>{
                        this.alertService.success("Insumo cadastrado com sucesso",true);
                        this.router.navigate(['/insumos'],{replaceUrl:true});
                    },
                    error: err =>{
                        this.alertService.danger("Erro ao cadastrar insumo");
                        console.log(err);
                    }
                })
            }
        }
        else{
            console.log(this.formInsumo)
        }
    }

    cancelar(){
        this.router.navigate(['/insumos'],{replaceUrl:true});
    }
}