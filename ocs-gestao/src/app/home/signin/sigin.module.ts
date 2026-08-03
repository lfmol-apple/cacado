import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { VMessageModule } from "app/shared/components/vmessage/vmessage.module";
import { AlertModule}   from "app/shared/components/alert/alert.module"

@NgModule({
    imports:[
        CommonModule,
        AlertModule
    ],
    declarations:[]
})
export class SigninComponent{}