import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './Auth/auth.service';
import { HeaderComponent } from './header/header.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { UiService } from './shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, LoadingSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'gamesApp';
  isLoading: boolean = false;
  loadingSub: Subscription;

  constructor(private router: Router, private authService: AuthService, private uiService: UiService){}

  ngOnInit(){
    this.authService.autoLogin();
    this.loadingSub = this.uiService.isLoading.subscribe(loading => {
      this.isLoading = loading;
    })
  }

  ngOnDestroy() {
    if(this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }
}
