import { AfterViewInit, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Game } from "../game.model";
import { ActivatedRoute } from "@angular/router";
import { GamesService } from "../games.service";
import { RatingStarsDirective } from "./rating-stars.directive";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faStar, faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ReviewService } from "../../shared/reviews/review.service";
import { Review } from "../../shared/reviews/review.model";
import { User } from "../../shared/user/user.model";
import { AuthService } from "../../Auth/auth.service";
import { UiService } from "../../shared/ui.service";
import { Subscription } from "rxjs";

@Component({
    standalone: true,
    selector: 'app-game-details',
    imports: [FontAwesomeModule, RatingStarsDirective, ReactiveFormsModule, CommonModule],
    templateUrl: './game-details.component.html',
    styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit, OnDestroy{
    ratingForm: FormGroup;
    currUser: User;
    currGameReviews: Review[] = [];
    gameReviewedBefore: boolean = false;
    reviewID: string = null;
    gameName: string;
    game: Game = new Game('Red Dead Redemption 2', 'red', 'assets/images/RDR2 icon.png', 147, 127, 'assets/images/RDR2 Full Image', 
    'America, 1899. The end of the Wild West era has begun. After a robbery goes badly wrong in the western town of Blackwater, Arthur Morgan and the Van der Linde gang are forced to flee. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive. As deepening internal divisions threaten to tear the gang apart, Arthur must make a choice between his own ideals and loyalty to the gang who raised him.', 
    new Date(), 0, 0);
    faStar = faStar;
    faThumbsUp = faThumbsUp;
    faThumbsDown = faThumbsDown;
    ratingErrorMessage : string = null;

    getReviewsSub: Subscription;
    addReviewSub: Subscription;
    updateReviewSub: Subscription;

    constructor(
        private authService: AuthService,
        private gamesService: GamesService, 
        private reviewService: ReviewService,
        private uiService: UiService, 
        private activatedRoute: ActivatedRoute){}
    
    ngOnInit(): void {
        this.initForm();
        this.activatedRoute.params.subscribe( res => {
            this.gameName = res['name'];
            this.game = this.gamesService.getGamebyName(this.gameName);
        })

        this.authService.userSubj.subscribe(user =>{
            this.currUser = user;
        })

        this.getReviewsSub = this.reviewService.getGameReviews(this.gameName).subscribe({
            next: (reviews) => {
                this.currGameReviews = reviews;
                const prevReview = this.currGameReviews.filter(r => r.username === this.currUser.username)
                this.gameReviewedBefore = this.currGameReviews.filter(r => r.username === this.currUser.username).length != 0
                this.reviewID = prevReview[0]?._id;
                console.log(reviews)
                if(this.gameReviewedBefore){
                    this.ratingForm.patchValue({
                        'review': prevReview[0].thoughtsOnGame,
                        'enoyed': prevReview[0].enjoyedGame,
                        'rating': prevReview[0].rating
                    })
                    this.uiService.prevRatingSubj.next(prevReview[0].rating);
                }
            }
        })
    }
    
    ngOnDestroy(): void {
        if(this.getReviewsSub){
            this.getReviewsSub.unsubscribe();
        }
        if(this.addReviewSub){
            this.addReviewSub.unsubscribe();
        }
        if(this.updateReviewSub){
            this.updateReviewSub.unsubscribe();
        }  
    }

    initForm() {
        this.ratingForm = new FormGroup({
            'review': new FormControl(''),
            'enjoyed': new FormControl(true),
            'rating': new FormControl(null, Validators.required)
        })
    }

    onSubmit(){
        if(this.ratingForm.valid){
            this.ratingErrorMessage = null;
            
            const review = new Review(
                this.currUser.username, 
                this.game.name, 
                this.ratingForm.get('review').value,
                this.ratingForm.get('enjoyed').value,
                this.ratingForm.get('rating').value,
                this.reviewID
            );

            if(this.gameReviewedBefore){
                this.updateReviewSub = this.reviewService.updateReview(review).subscribe(
                    {
                        next: res => console.log(res),
                        complete: () => {
                            this.uiService.prevRatingSubj.next(review.rating);
                            this.gameReviewedBefore = true;
                            this.currGameReviews = this.currGameReviews.map(r => {
                                if(r._id === this.reviewID){
                                    return review;
                                } 
                                return r;
                            });
                        }
                    }
                )
            } else{
                this.addReviewSub = this.reviewService.addReview(review).subscribe(
                    {
                        next: res => console.log(res),
                        complete: () => {
                            this.uiService.prevRatingSubj.next(review.rating);
                            this.gameReviewedBefore = true;
                            this.currGameReviews.push(review);
                        }
                    }
                )
            }   
            console.log(this.ratingForm);
        } else {
            this.ratingErrorMessage = "please give a rating before submitting"
        }
        
    }
    
}