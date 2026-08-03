import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule,LOCALE_ID  } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { SigninComponent } from './home/signin/signin.component';
import { VMessageModule } from './shared/components/vmessage/vmessage.module';
import { AlertModule } from './shared/components/alert/alert.module';
import { RequestIterceptor } from './core/auth/request.interceptor';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    VMessageModule,
    AlertModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    SigninComponent
  ],
  providers:[{
      provide: HTTP_INTERCEPTORS,
      useClass: RequestIterceptor,
      multi: true
  },{ provide: LOCALE_ID, useValue: 'pt-BR' } ],
  bootstrap: [AppComponent]
 
})
export class AppModule { }
