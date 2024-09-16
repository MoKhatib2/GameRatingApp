import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Game } from "../../Games/game.model";
import { GamesService } from "../../Games/games.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { HostListener } from "@angular/core";

@Component({
    standalone: true,
    selector: 'app-search-games',
    imports: [FormsModule, AutoCompleteModule],
    templateUrl: './search-games.component.html',
    styleUrls: ['./search-games.component.css']
})
export class SearchGamesComponent implements OnInit, OnDestroy{
    games: Game[] = [];
    filteredGames: Game[] = [];
    selectedGame: Game;
    gamesSub: Subscription;

    constructor(private gamesService: GamesService, private router: Router) {}

    ngOnInit(): void {
        this.gamesSub = this.gamesService.gamesSubject.subscribe(games => this.games = games);
    }

    ngOnDestroy(): void {
        if(this.gamesSub) {
            this.gamesSub.unsubscribe();
        }
    }

    filterGame(event: {query: string}) {
        this.filteredGames = [];
        const searchQuery = event.query.toLowerCase();
        this.filteredGames = this.games.filter(game => game.name.toLowerCase().includes(searchQuery));      
    }

    onChooseGame(chosenGame: Game) {
        console.log(chosenGame)
        if (chosenGame) {
            this.router.navigate(['/games', chosenGame.name]);
        }      
    }

    @HostListener('keyup.enter', ['$event']) 
    onEnter(event: KeyboardEvent) {
        if (this.selectedGame && this.selectedGame.name) {
            this.router.navigate(['/games', this.selectedGame.name]);
        }
    }

}