import { Routes } from '@angular/router';
import { GamesComponent } from './Games/games.component';
import { AuthGaurd } from './Auth/auth.gaurd';
import { LoginComponent } from './Auth/login/login.component';
import { SignupComponent } from './Auth/signup/signup.component';
import { GameDetailsComponent } from './Games/game-details/game-details.component';

export const routes: Routes = [
    {path: '', component: GamesComponent, canActivate: [AuthGaurd], pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'game-details/:name', component: GameDetailsComponent, canActivate: [AuthGaurd]}
];

