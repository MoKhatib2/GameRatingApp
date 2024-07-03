import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Review } from "./review.model";
import { map, tap } from "rxjs";
import { Game } from "../../Games/game.model";
import { User } from "../user/user.model";

@Injectable({providedIn: 'root'})
export class ReviewService {

    constructor(private http: HttpClient){}

    getAllReviews() {
        return this.http.get<Review[]>(`${environment.API_URL}/private/reviews`)
            .pipe(
                tap(reviews => console.log(reviews)),
                map(reviews => {
                    if(reviews){
                        return reviews;
                    }
                    return []
                })
            );
    }

    getGameReviews(gameName: string) {
        return this.http.get<{review: Review, user: User}[]>(`${environment.API_URL}/private/reviews/getReviewsWithUsers/${gameName}`)
    }

    addReview(review: Review){
        return this.http.post<{game: Game, newOverallRating: number}>(`${environment.API_URL}/private/reviews/addReview`, { review })
    }

    updateReview(review: Review) {
        return this.http.put<{game: Game, newOverallRating: number}>(`${environment.API_URL}/private/reviews/updateReview/${review._id}`, { review })
    }
}