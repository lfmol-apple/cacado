import { Component, OnInit } from '@angular/core';
import { RotaService } from 'app/core/rota/rota.service';
import { UserService } from 'app/core/user/user.service';
import {RouteInfo} from "../../core/rota/rota";
import { Router } from '@angular/router';
declare const $: any;

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/vendas', title: 'Vendas',  icon: 'add_business', class: '' },
    { path: '/compras', title: 'Compras',  icon: 'shopping_cart', class: '' },
    { path: '/movimentacoes', title: 'Movimentações',  icon: 'dynamic_feed', class: '' },
    { path: '/fornecedores', title: 'Fornecedores',  icon: 'assignment_ind', class: '' },
    { path: '/clientes', title: 'Clientes',  icon: 'attribution', class: '' },
    { path: '/produtos', title: 'Produtos',  icon: 'category', class: '' },
    { path: '/insumos', title: 'Insumos',  icon: 'interests', class: '' },
    { path: '/cadastros', title: 'Cadastros',  icon: 'storage', class: '' },
    { path: '/grupos_usuarios', title: 'Grupos de Usuários',  icon: 'group', class: '' },
    { path: '/usuarios', title: 'Usuários',  icon: 'person', class: '' },
    { path: '/galpoes', title: 'Galpões',  icon: 'warehouse', class: '' },
    { path: '/movgalpoes', title: 'Movimentações Galpão',  icon: 'warehouse', class: '' },
    // { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(
    private userService: UserService,
    private rotaService: RotaService,
    private router: Router
  ) { }


  logOut(){
    this.router.navigate(['']);
  }

  ngOnInit() {
    console.log("IDUsuarioLogado:", this.userService.getUserID());
    let IdUsu = this.userService.getUserID()[0];
    if (IdUsu){
      this.rotaService.GetByUsuario(parseInt(IdUsu))
      .subscribe({
        next: res =>{
          console.log(res);
          this.menuItems = res;
        },
        error: err=>{
          console.log(err);
        }
      })
    }
   // this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
