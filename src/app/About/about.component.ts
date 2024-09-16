import { Component, OnInit } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-about',
    template: `
    <div>
        <p>This a website where you can search for favourite games and share your rating and reviews with others. Enjoy!</p>
    </div>`,
    styles: ['p {color: white; font-size: 30px; font-weight: bold;}']
})

export class AboutComponent {

} 
