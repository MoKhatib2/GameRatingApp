import { Injectable} from "@angular/core";
import { Subject, tap } from "rxjs";
import { Game } from "./game.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.development";

@Injectable({providedIn: 'root'})
export class GamesService {
    private games: Game[] = [
        // new Game('Red Dead Redemption 2', 'red', 'assets/images/RDR2 icon.png', 'assets/images/RDR2 Full Image.png',
        // 'assets/images/RDR2 Cover Image.jpg',
        // 'America, 1899. The end of the Wild West era has begun. After a robbery goes badly wrong in the western town of Blackwater, Arthur Morgan and the Van der Linde gang are forced to flee. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive. As deepening internal divisions threaten to tear the gang apart, Arthur must make a choice between his own ideals and loyalty to the gang who raised him.', 
        // new Date(), 0, 0), 
        // new Game('The Last of Us', '#303021', 'assets/images/TLOU icon.png', 'assets/images/TLOU Full Image.png',
        // 'assets/images/TLOU Cover Image.jpg', 
        // 'Experience the emotional storytelling and unforgettable characters in The Last of Us, winner of over 200 Game of the Year awards. In a ravaged civilization, where infected and hardened survivors run rampant, Joel, a weary protagonist, is hired to smuggle 14-year-old Ellie out of a military quarantine zone. However, what starts as a small job soon transforms into a brutal cross-country journey.', 
        // new Date(), 0, 0),
        // new Game('Life is Strange', '#FBFBFB', 'assets/images/Life is Strange icon.png', 'assets/images/Life is Strange Full Image.png',
        // 'assets/images/Life is Strange Cover Image.png', 
        // 'Follow the story of Max Caulfield, a photography senior who discovers she can rewind time while saving her best friend Chloe Price. The pair soon find themselves investigating the mysterious disappearance of fellow student Rachel Amber, uncovering a dark side to life in Arcadia Bay. Meanwhile, Max must quickly learn that changing the past can sometimes lead to a devastating future.', 
        // new Date(), 0, 0
        // ),
        // new Game('God of War Ragnarok', '#86A1B9', 'assets/images/GOW icon.png', 'assets/images/GOW Full Image.png',
        // 'assets/images/GOW Cover Image.jpg',
        // 'From Santa Monica Studio comes the sequel to the critically acclaimed God of War (2018). Fimbulwinter is well underway. Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world. Along the way they will explore stunning, mythical landscapes, and face fearsome enemies in the form of Norse gods and monsters. The threat of Ragnarök grows ever closer. Kratos and Atreus must choose between their own safety and the safety of the realms.', 
        // new Date(), 0, 0
        // ),
        // new Game('Until Dawn', '#1B2632', 'assets/images/Until Dawn icon.png', 'assets/images/Until Dawn Full Image.png',
        // 'assets/images/Until Dawn Cover Image.jpg',
        // 'When eight friends return to the isolated lodge where two of their group vanished a year prior, fear tightens its icy grip, and their mountain retreat descends into a nightmare with no escape.', 
        // new Date(), 0, 0
        // ),
        // new Game('Detroit Become Human', '#3378B8', 'assets/images/DBH icon.png', 'assets/images/DBH Full Image.png',
        // 'assets/images/DBH Cover Image.jpg',
        // 'Set in Detroit City during the year 2036, the city has been revitalized by the invention and introduction of Androids into everyday life. But when Androids start behaving as if they are alive, events begin to spin out of control. Step into the roles of the story’s pivotal three playable characters, each with unique perspectives as they face their new way of life. In this ambitiously bending and thrilling narrative, every choice and action will not only determine the character’s fate, but that of the entire city and possibly beyond.', 
        // new Date(), 0, 0
        // ),
        // new Game('Elden Ring', '#D4AF37', 'assets/images/Elden Ring icon.png', 'assets/images/Elden Ring Full Image.png',
        // 'assets/images/Elden Ring Cover Image.png',
        // 'A vast world where open fields with a variety of situations and huge dungeons with complex and three-dimensional designs are seamlessly connected. As you explore, the joy of discovering unknown and overwhelming threats await you, leading to a high sense of accomplishment.', 
        // new Date(), 0, 0
        // ),
        // new Game('Balders Gate 3', '#321E41', 'assets/images/BG3 icon.png', 'assets/images/BG3 Full Image.png',
        // 'assets/images/BG3 Cover Image.png',
        // 'Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power. Mysterious abilities are awakening inside you, drawn from a mind flayer parasite planted in your brain. Resist, and turn darkness against itself. Or embrace corruption, and become ultimate evil.', 
        // new Date(), 0, 0
        // )
    ]
    gamesSubject = new Subject<Game[]>();

    constructor(private http: HttpClient){}

    getGames(){
        return this.http.get<Game[]>(`${environment.API_URL}/private/games/getGames`)
            .pipe(
                tap( games => {
                    this.games = games;
                    this.gamesSubject.next(this.games.slice());
                })
            )
    }

    getGame(id: number){
        return this.games[id];
    }

    getGamebyName(name: string){
        return this.games.filter(game => {return game.name === name})[0];
    }
}