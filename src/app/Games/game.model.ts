export class Game {
    constructor(
        public name: string, 
        public mainColor: string, 
        public imageIconURL: string, 
        public iconWidth: number, 
        public iconHeight: number,
        public imageURL: string,
        public description: string,
        public releaseDate: Date,
        public rating: number,
        public numOfReviews: number) {}
    }