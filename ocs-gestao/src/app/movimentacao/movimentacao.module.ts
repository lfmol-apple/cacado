import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AlertModule } from "app/shared/components/alert/alert.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { RequestIterceptor } from "app/core/auth/request.interceptor";
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ListaMovimentacaoComponent } from "./lista-movimentacao.component";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MovimentacaoComponent } from "./movimentacao.component";
@NgModule({
    declarations:[
        ListaMovimentacaoComponent,
        MovimentacaoComponent
    ],
    imports:[
        FormsModule,
        CommonModule,
        AlertModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatExpansionModule,
        MatAutocompleteModule,
        MatSlideToggleModule        
    ],
    providers:[{
        provide: HTTP_INTERCEPTORS,
        useClass: RequestIterceptor,
        multi:true
    }]
})

export class MovimentacaoModule{}