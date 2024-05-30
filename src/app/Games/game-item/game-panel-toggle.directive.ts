import { 
    Directive, 
    Renderer2, 
    OnInit, 
    ElementRef, 
    HostListener,
    HostBinding,
    Input} from '@angular/core';
  
  @Directive({
    standalone: true,
    selector: '[appToggleGamePanel]'
  })
  export class ToggleGamePanelDirective implements OnInit{
    @HostBinding('class.open') isOpen: boolean = false;
    
    constructor(private elRef: ElementRef, private renderer: Renderer2) { }
  
    ngOnInit() {}
  
    @HostListener('document:click', ['$event']) toggleOpen(eventData: Event){
      if (this.elRef.nativeElement.contains(eventData.target)) {
        if(!this.elRef.nativeElement.querySelector('.go-btn').contains(eventData.target)){
          this.elRef.nativeElement.querySelector('img').classList.toggle('hidden');
          this.elRef.nativeElement.querySelector('.go-btn').classList.toggle('hidden');
          this.isOpen = !this.isOpen;
        }
      } else {
        if (this.isOpen) {
          this.elRef.nativeElement.querySelector('img').classList.toggle('hidden');
          this.elRef.nativeElement.querySelector('.go-btn').classList.toggle('hidden');
        }
        this.isOpen = false;
      }
    }
  
  }
  