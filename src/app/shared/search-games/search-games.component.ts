import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Game } from "../../Games/game.model";
import { GamesService } from "../../Games/games.service";
import { Subscription } from "rxjs";

@Component({
    standalone: true,
    selector: 'app-search-games',
    imports: [FormsModule, AutoCompleteModule],
    templateUrl: './search-games.component.html'
})
export class SearchGamesComponent implements OnInit, OnDestroy{
    games: Game[] = [];
    filteredGames: Game[] = [];
    selectedGame: Game;
    gamesSub: Subscription;

    constructor(private gamesService: GamesService) {}

    ngOnInit(): void {
        this.gamesSub = this.gamesService.gamesSubject.subscribe(games => this.games = games);
    }

    ngOnDestroy(): void {
        if(this.gamesSub) {
            this.gamesSub.unsubscribe();
        }
    }

    filterGame(event: any) {
        console.log(event.query)
        this.filteredGames.push(this.games.filter(g => g.name === 'Red Dead Redemption 2')[0]);
        console.log(this.filteredGames);
    }
}