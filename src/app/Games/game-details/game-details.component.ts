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
import { FormatDatePipe } from "../../shared/dateFormat.pipe";
import { UserService } from "../../shared/user/user.service";

@Component({
    standalone: true,
    selector: 'app-game-details',
    imports: [FontAwesomeModule, RatingStarsDirective, ReactiveFormsModule, CommonModule, FormatDatePipe],
    templateUrl: './game-details.component.html',
    styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit, OnDestroy{
    ratingForm: FormGroup;
    currUser: User;
    currGameReviews: {review: Review, user: User}[] = [];
    gameReviewedBefore: boolean = false;
    reviewID: string = null;
    gameName: string;
    game: Game;
    usersThatReviewedGame: User[] = [];
    defaultProfileImagePath: string = '../../assets/images/profileImage.png';
    faStar = faStar;
    faThumbsUp = faThumbsUp;
    faThumbsDown = faThumbsDown;
    ratingErrorMessage : string = null;
    getReviewsSub: Subscription;
    addReviewSub: Subscription;
    updateReviewSub: Subscription;
    usersSub: Subscription;

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
            next: (response) => {
                console.log(response);
                this.currGameReviews = response;
                console.log(this.currGameReviews);
                const prevReview = this.currGameReviews.filter(r => r.review.userID === this.currUser._id)
                this.gameReviewedBefore = this.currGameReviews.filter(r => r.review.userID === this.currUser._id).length != 0
                this.reviewID = prevReview[0]?.review._id;
                if(this.gameReviewedBefore){
                    this.ratingForm.patchValue({
                        'review': prevReview[0].review.thoughtsOnGame,
                        'enoyed': prevReview[0].review.enjoyedGame,
                        'rating': prevReview[0].review.rating
                    })
                    this.uiService.prevRatingSubj.next(prevReview[0].review.rating);
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
                this.currUser._id, 
                this.game.name, 
                this.ratingForm.get('review').value,
                this.ratingForm.get('enjoyed').value,
                this.ratingForm.get('rating').value,
                this.reviewID
            );

            if(this.gameReviewedBefore){
                this.updateReviewSub = this.reviewService.updateReview(review).subscribe(
                    {
                        next: res => {
                            this.uiService.prevRatingSubj.next(review.rating);
                            this.gameReviewedBefore = true;
                            this.currGameReviews = this.currGameReviews.map(r => {
                                if(r.review._id === this.reviewID){
                                    return {review, user: r.user};
                                } 
                                return r;
                            });
                            console.log(res)
                            this.game.rating = res.newOverallRating;
                        }
                    }
                )
            } else{
                this.addReviewSub = this.reviewService.addReview(review).subscribe(
                    {
                        next: res => {
                            this.uiService.prevRatingSubj.next(review.rating);
                            this.gameReviewedBefore = true;
                            this.currGameReviews.push({review, user: this.currUser});
                            console.log(res)
                            this.game.rating = res.newOverallRating;
                        },
                    }
                )
            }   
            console.log(this.ratingForm);
        } else {
            this.ratingErrorMessage = "please give a rating before submitting"
        }
        
    }
    
}