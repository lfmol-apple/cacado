import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FornecedoresComponent } from "./fornecedores/fornecedores.component";
import { CommonModule } from "@angular/common";
import { AlertModule } from "app/shared/components/alert/alert.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { RequestIterceptor } from "app/core/auth/request.interceptor";
import { FornecedorComponent } from "./fornecedores/fornecedor.component";
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { ClientesComponent } from "./cliente/clientes.component";
import { ClienteComponent } from "./cliente/cliente.component";
import { ProdutosComponent } from "./produto/produtos.component";
import { ProdutoComponent } from "./produto/produto.component";
import { InsumosComponent } from "./insumo/insumos.component";
import { InsumoComponent } from "./insumo/insumo.component";
import { CadastrosAuxiliaresComponent } from "./auxiliares/cadastros-auxiliares.component";
import { ListaGrupoUsuariosComponent } from "./usuario/lista-grupo-usuarios.component";
import { ListaUsuariosComponent } from "./usuario/lista-usuarios.component";
import { ListaGalpaoComponent } from "./galpao/lista-galpao.component";
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
    declarations:[
        FornecedoresComponent,
        FornecedorComponent,
        ClientesComponent,
        ClienteComponent,
        ProdutosComponent,
        ProdutoComponent,
        InsumosComponent,
        InsumoComponent,
        CadastrosAuxiliaresComponent,
        ListaGrupoUsuariosComponent,
        ListaUsuariosComponent,
        ListaGalpaoComponent
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
        MatSlideToggleModule       
    ],
    providers:[{
        provide: HTTP_INTERCEPTORS,
        useClass: RequestIterceptor,
        multi:true
    }]
})

export class CadastrosModule{}