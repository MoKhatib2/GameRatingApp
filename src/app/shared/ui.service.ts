import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class UiService {
    prevRatingSubj = new Subject<number>();
    isLoading = new Subject<boolean>();
    
    constructor(){
        
    }
}