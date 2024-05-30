import { Injectable} from "@angular/core";
import { Subject } from "rxjs";
import { Game } from "./game.model";

@Injectable({providedIn: 'root'})
export class GamesService {
    private games: Game[] = [
        new Game('Red Dead Redemption 2', 'red', 'assets/images/RDR2 icon.png', 147, 127, 'assets/images/RDR2 Full Image', 
        'America, 1899. The end of the Wild West era has begun. After a robbery goes badly wrong in the western town of Blackwater, Arthur Morgan and the Van der Linde gang are forced to flee. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive. As deepening internal divisions threaten to tear the gang apart, Arthur must make a choice between his own ideals and loyalty to the gang who raised him.', 
        new Date(), 0, 0), 
        new Game('The Last of Us', '#303021', 'assets/images/TLOU icon.png', 147, 127, 'assets/images/TLOU Full Image', 
        '', 
        new Date(), 0, 0),
        new Game('Life is Strange', '#FBFBFB', 'assets/images/Life is Strange icon.png', 155, 127, 'assets/images/Life is Strange Full Image',
        '', 
        new Date(), 0, 0
        ),
        new Game('God of War Ragnarok', '#86A1B9', 'assets/images/GOW icon.png',  147, 127, 'assets/images/GOW Full Image',
        '', 
        new Date(), 0, 0
        ),
        new Game('Until Dawn', '#1B2632', 'assets/images/Until Dawn icon.png', 147, 127, 'assets/images/Until Dawn Full Image',
        '', 
        new Date(), 0, 0
        ),
        new Game('Detroit Become Human', '#3378B8', 'assets/images/DBH icon.png', 147, 127, 'assets/images/DBH Full Image',
        '', 
        new Date(), 0, 0
        ),
        new Game('Elden Ring', '#D4AF37', 'assets/images/Elden Ring icon.png', 147, 127, 'assets/images/Elden Ring Full Image',
        '', 
        new Date(), 0, 0
        ),
        new Game('Balders Gate 3', '#321E41', 'assets/images/BG3 icon.png', 147, 127, 'assets/images/BG3 Full Image',
        '', 
        new Date(), 0, 0
        )
    ]

    // private games: Game[] = [
    //     new Game('Red Dead Redemption 2', '#3D2F2F', 'assets/images/RDR2 icon.png', 147, 127, 'assets/images/RDR2 Full Image'), 
    //     new Game('The Last of Us', '#254117', 'assets/images/TLOU icon.png', 147, 127, 'assets/images/TLOU Full Image'),
    //     new Game('Life is Strange', '#AEE0E3', 'assets/images/Life is Strange icon.png', 155, 127,  'assets/images/Life is Strange Full Image'),
    //     new Game('God of War Ragnarok', '#8B0000', 'assets/images/GOW icon.png',  147, 127, 'assets/images/GOW Full Image'),
    //     new Game('Until Dawn', '#4B0082', 'assets/images/Until Dawn icon.png', 147, 127, 'assets/images/Until Dawn Full Image'),
    //     new Game('Detroit Become Human', '#C0C0C0', 'assets/images/DBH icon.png', 147, 127, 'assets/images/DBH Full Image'),
    //     new Game('Elden Ring', '#006400', 'assets/images/Elden Ring icon.png', 147, 127, 'assets/images/Elden Ring Full Image'),
    //     new Game('Balders Gate 3', '#DC143C', 'assets/images/BG3 icon.png', 147, 127, 'assets/images/BG3 Full Image')
    // ]

    gamesSubject = new Subject<Game[]>()

    getGames(){
        return this.gamesSubject.next(this.games.slice());
    }

    getGame(id: number){
        return this.games[id];
    }

    getGamebyName(name: string){
        return this.games.filter(game => {return game.name === name})[0];
    }
}