import { Component, Input } from '@angular/core';

@Component({
    selector: 'ocs-vmessage',
    templateUrl: './vmessage.component.html'
})
export class VMessageComponent{
    @Input() text = '';
}