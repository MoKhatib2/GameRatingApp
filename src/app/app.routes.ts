import { Routes } from '@angular/router';
import { GamesComponent } from './Games/games.component';
import { AuthGaurd } from './Auth/auth.gaurd';
import { LoginComponent } from './Auth/login/login.component';
import { SignupComponent } from './Auth/signup/signup.component';
import { GameDetailsComponent } from './Games/game-details/game-details.component';
import { GamesResolver } from './Games/games.resolver';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './About/about.component';

export const routes: Routes = [
    {path: '', redirectTo: '/games', pathMatch: 'full'},
    {path: 'games', component: GamesComponent, resolve:[GamesResolver]},
    {path: 'games/:name', component: GameDetailsComponent, canActivate: [AuthGaurd], resolve:[GamesResolver]},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGaurd]},
    {path: 'about', component: AboutComponent},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
];

