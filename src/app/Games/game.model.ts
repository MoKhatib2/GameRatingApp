export class Game {
    constructor(
        public name: string, 
        public mainColor: string, 
        public imageIconPath: string, 
        public imagePath: string,  
        public coverPath: string,
        public description: string,
        public releaseDate: Date,
        public rating: number,
        public numOfReviews: number) {}
    }