import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../Auth/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{
  userSub: Subscription;
  isAuthenticated: boolean = false;

  constructor(private router: Router, private authService: AuthService){}

  ngOnInit(): void {
    this.userSub = this.authService.userSubj.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    } 
  }

  onLogout() {
    this.authService.logout();
  }

}
