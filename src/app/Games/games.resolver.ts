import { ActivatedRouteSnapshot, MaybeAsync, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { Game } from "./game.model";
import { GamesService } from "./games.service";

export const GamesResolver : ResolveFn<Game[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let games: Game[] = [];
    const gamesService = inject(GamesService);
    gamesService.gamesSubject.subscribe((res: Game[]) => {
        games = res;
    })
    if (games.length === 0) {
        return gamesService.getGames();
    } else {
        return games;
    }
}