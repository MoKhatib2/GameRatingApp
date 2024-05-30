import { Directive, ElementRef, Renderer2, HostListener, HostBinding, OnInit, Input, AfterViewInit } from "@angular/core";
import { UiService } from "../../shared/ui.service";

@Directive({
    standalone: true,
    selector: '[appRatingStars]'
})
export class RatingStarsDirective implements OnInit, AfterViewInit{
        chosenRating: number = 0;
        star1: any;
        star2: any;
        star3: any;
        star4: any;
        star5: any;    

    constructor(
        private elRef: ElementRef, 
        private renderer: Renderer2,
        private uiService: UiService){
    } 

    ngOnInit() {
        this.star1 = this.elRef.nativeElement.querySelector('#star1-div');
        this.star2 = this.elRef.nativeElement.querySelector('#star2-div');
        this.star3 = this.elRef.nativeElement.querySelector('#star3-div');
        this.star4 = this.elRef.nativeElement.querySelector('#star4-div');
        this.star5 = this.elRef.nativeElement.querySelector('#star5-div');
    }

    ngAfterViewInit(): void {
        this.uiService.prevRatingSubj.subscribe(rating => {
            this.chosenRating = rating
            if(this.chosenRating!=0){
                console.log(this.chosenRating)
                this.removeHighlighted();
                this.addHighlighted(this.chosenRating);
            }
        })        
    }

    @HostListener('document:mouseover', ['$event']) onMouseEnter(eventData: Event){
        if (this.star1?.contains(eventData?.target)) {
            this.removeHighlighted();
            this.addHighlighted(1);
        } else if (this.star2?.contains(eventData?.target)) {
            this.removeHighlighted();
            this.addHighlighted(2);
        } else if (this.star3?.contains(eventData?.target)) {
            this.removeHighlighted();
            this.addHighlighted(3);
        } else if (this.star4?.contains(eventData?.target)) {
            this.removeHighlighted();
            this.addHighlighted(4);
        } else if (this.star5?.contains(eventData?.target)) {
            this.addHighlighted(5);
        } else{
            this.removeHighlighted();
        }
    }

    @HostListener('document:click', ['$event']) onMouseClick(eventData: Event){
        if (this.star1?.contains(eventData?.target)) {
            this.chosenRating = 1;
            this.removeHighlighted();
            this.addHighlighted(1);
        } else if (this.star2?.contains(eventData?.target)) {
            this.chosenRating = 2;
            this.removeHighlighted();
            this.addHighlighted(2);
        } else if (this.star3?.contains(eventData?.target)) {
            this.chosenRating = 3;
            this.removeHighlighted();
            this.addHighlighted(3);
        } else if (this.star4?.contains(eventData?.target)) {
            this.chosenRating = 4;
            this.removeHighlighted();
            this.addHighlighted(4);
        } else if (this.star5?.contains(eventData?.target)) {
            this.chosenRating = 5;
            this.removeHighlighted();
            this.addHighlighted(5);
        } else{
            this.removeHighlighted();
        }
    }

    addHighlighted(starNumber : number){
        switch(starNumber){
            case 1: 
                this.renderer.addClass(this.star1?.querySelector('.highlighted'), 'selected');
                break;
            case 2: 
                this.renderer.addClass(this.star1?.querySelector('.highlighted'), 'selected');
                this.renderer.addClass(this.star2?.querySelector('.highlighted'), 'selected');
                break;
            case 3: 
                this.renderer.addClass(this.star1?.querySelector('.highlighted'), 'selected');
                this.renderer.addClass(this.star2?.querySelector('.highlighted'), 'selected');
                this.renderer.addClass(this.star3?.querySelector('.highlighted'), 'selected');
                break;
            case 4: 
                this.renderer.addClass(this.star1?.querySelector('.highlighted'), 'selected');
                this.renderer.addClass(this.star2?.querySelector('.highlighted'), 'selected');
                this.renderer.addClass(this.star3?.querySelector('.highlighted'), 'selected');
                this.renderer.addClass(this.star4?.querySelector('.highlighted'), 'selected');
                break;
            case 5: 
                this.renderer.addClass(this.star1?.querySelector('.highlighted'), 'selected');
                this.renderer.addClass(this.star2?.querySelector('.highlighted'), 'selected');
                this.renderer.addClass(this.star3?.querySelector('.highlighted'), 'selected');
                this.renderer.addClass(this.star4?.querySelector('.highlighted'), 'selected');
                this.renderer.addClass(this.star5?.querySelector('.highlighted'), 'selected');
                break; 
            default:
                break;                
        }
    }

    removeHighlighted(){
        switch(this.chosenRating){
            case 0:
                this.renderer.removeClass(this.star1?.querySelector('.highlighted'), 'selected');
                this.renderer.removeClass(this.star2?.querySelector('.highlighted'), 'selected');
                this.renderer.removeClass(this.star3?.querySelector('.highlighted'), 'selected');
                this.renderer.removeClass(this.star4?.querySelector('.highlighted'), 'selected');
                this.renderer.removeClass(this.star5?.querySelector('.highlighted'), 'selected');
                break;
            case 1:
                this.renderer.removeClass(this.star2?.querySelector('.highlighted'), 'selected');
                this.renderer.removeClass(this.star3?.querySelector('.highlighted'), 'selected');
                this.renderer.removeClass(this.star4?.querySelector('.highlighted'), 'selected');
                this.renderer.removeClass(this.star5?.querySelector('.highlighted'), 'selected');
                break;
            case 2:
                this.renderer.removeClass(this.star3?.querySelector('.highlighted'), 'selected');
                this.renderer.removeClass(this.star4?.querySelector('.highlighted'), 'selected');
                this.renderer.removeClass(this.star5?.querySelector('.highlighted'), 'selected');
                break;
            case 3:
                this.renderer.removeClass(this.star4?.querySelector('.highlighted'), 'selected');
                this.renderer.removeClass(this.star5?.querySelector('.highlighted'), 'selected');
                break;  
            case 4:
                this.renderer.removeClass(this.star5?.querySelector('.highlighted'), 'selected');
                break;
            default:
                break;    
        }
    }

}