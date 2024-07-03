import { Component } from "@angular/core";

@Component({
    standalone: true,
    selector: 'app-loading-spinner',
    template: 
        '<div style="margin-bottom: -200px;" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>',
    styleUrls: ['./loading-spinner.component.css']    
})
export class LoadingSpinnerComponent {}