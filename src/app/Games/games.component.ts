import { Component, OnDestroy, OnInit } from '@angular/core';
import { GamesService } from './games.service';
import { Game } from './game.model';
import { Subscription } from 'rxjs';
import { GameItemComponent } from './game-item/game-item.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [GameItemComponent, RouterModule, CommonModule],
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent implements OnInit, OnDestroy{
  games: Game[] = [];
  subscription: Subscription | undefined

  constructor(private gamesSevice: GamesService) {}

  ngOnInit(): void {
      this.subscription = this.gamesSevice.gamesSubject.subscribe(games => {
        this.games = games;
      })
      this.gamesSevice.getGames()
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
