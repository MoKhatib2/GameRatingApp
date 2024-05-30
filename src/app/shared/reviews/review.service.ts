import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Review } from "./review.model";
import { map, tap } from "rxjs";

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
        return this.http.get<Review[]>(`${environment.API_URL}/private/reviews/${gameName}`)
    }

    setReviews(reviews: Review[]) {
        return this.http.put(environment.FirebaseURL + '/reviews.json', reviews);
    }

    addReview(review: Review){
        return this.http.post(`${environment.API_URL}/private/addReview`, { review })
    }

    updateReview(review: Review){
        return this.http.put(`${environment.API_URL}/private/updateReview/${review._id}`, { review })
    }
}