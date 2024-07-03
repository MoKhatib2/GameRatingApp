import { Component, OnDestroy, OnInit } from '@angular/core';
import { GamesService } from './games.service';
import { Game } from './game.model';
import { Subscription } from 'rxjs';
import { GameItemComponent } from './game-item/game-item.component';
import { SearchGamesComponent } from '../shared/search-games/search-games.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [GameItemComponent, RouterModule, CommonModule, SearchGamesComponent],
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent implements OnInit, OnDestroy{
  games: Game[] = [];
  subscription: Subscription | undefined

  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {
      this.subscription = this.gamesService.gamesSubject.subscribe(games => {
        this.games = games;
      })
      this.gamesService.getGames().subscribe();
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
