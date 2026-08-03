import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { FornecedoresComponent } from 'app/cadastros/fornecedores/fornecedores.component';
import { FornecedorComponent } from 'app/cadastros/fornecedores/fornecedor.component';
import { SigninComponent } from 'app/home/signin/signin.component';
import { AuthGuard } from 'app/core/auth/auth.guard';
import { ClientesComponent } from 'app/cadastros/cliente/clientes.component';
import { ClienteComponent } from 'app/cadastros/cliente/cliente.component';
import { ProdutosComponent } from 'app/cadastros/produto/produtos.component';
import { ProdutoComponent } from 'app/cadastros/produto/produto.component';
import { InsumosComponent } from 'app/cadastros/insumo/insumos.component';
import { InsumoComponent } from 'app/cadastros/insumo/insumo.component';
import { ListaVendasComponent } from 'app/vendas/lista-vendas.component';
import { VendaCompnent } from 'app/vendas/venda.component';
import { ListaComprasComponent } from 'app/compras/lista-compras.component';
import { CompraCompnent } from 'app/compras/compra.component';
import { CadastrosAuxiliaresComponent } from 'app/cadastros/auxiliares/cadastros-auxiliares.component';
import { ListaMovimentacaoComponent } from 'app/movimentacao/lista-movimentacao.component';
import { MovimentacaoComponent } from 'app/movimentacao/movimentacao.component';
import { ListaGrupoUsuariosComponent } from 'app/cadastros/usuario/lista-grupo-usuarios.component';
import { ListaUsuariosComponent } from 'app/cadastros/usuario/lista-usuarios.component';
import { ListaGalpaoComponent } from 'app/cadastros/galpao/lista-galpao.component';
import { ListaGalpaoMovimentacaoComponent } from 'app/galpao_movimentacao/lista-galpao_movimentacao.component';
import { GalpaoMovimentacaoComponent } from 'app/galpao_movimentacao/galpao-movimentacao.component';

export const AdminLayoutRoutes: Routes = [

    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    {   
        path: 'fornecedores',   
        component: FornecedoresComponent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'fornecedor/:idfornecedor',   
        component: FornecedorComponent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'clientes',   
        component: ClientesComponent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'cliente/:idcliente',   
        component: ClienteComponent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'produtos',   
        component: ProdutosComponent, 
        canActivate:[AuthGuard]
    },  
    {   
        path: 'produto/:idproduto',   
        component: ProdutoComponent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'insumos',   
        component: InsumosComponent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'insumo/:idinsumo',   
        component: InsumoComponent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'vendas',   
        component: ListaVendasComponent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'venda/:idvenda',   
        component: VendaCompnent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'compras',   
        component: ListaComprasComponent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'compra/:idcompra',   
        component: CompraCompnent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'cadastros',   
        component: CadastrosAuxiliaresComponent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'movimentacoes',   
        component: ListaMovimentacaoComponent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'movimentacao/:idmovimentacao',   
        component: MovimentacaoComponent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'grupos_usuarios',   
        component: ListaGrupoUsuariosComponent, 
        canActivate:[AuthGuard]
    },
    {   
        path: 'usuarios',   
        component: ListaUsuariosComponent, 
        canActivate:[AuthGuard]
    },
    {
        path:'galpoes',
        component: ListaGalpaoComponent
    },
    {
        path:'movgalpoes',
        component: ListaGalpaoMovimentacaoComponent
    },
    {
        path:'movgalpao/:idmovimentacao',
        component: GalpaoMovimentacaoComponent
    }


];
