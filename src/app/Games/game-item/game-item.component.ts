import { Component, Input  } from "@angular/core";
import { Game } from "../game.model";
import { ToggleGamePanelDirective } from "./game-panel-toggle.directive";
import { Router } from "@angular/router";

@Component({
    standalone: true,
    imports: [ToggleGamePanelDirective],
    selector: 'app-game-item',
    templateUrl: './game-item.component.html',
    styleUrls: ['./game-item.component.css']
})
export class GameItemComponent {
    @Input() game: Game = new Game('The Last of Us', '#303021', 'assets/images/TLOU icon.png', 'assets/images/TLOU Full Image', 
        'assets/images/TLOU Cover Image.png',
        '', 
        new Date(), 0, 0) 

    constructor(private router: Router){}

    onGoToGame(){
        console.log('pressed button')
        this.router.navigate(['/games', this.game.name])
    }
}