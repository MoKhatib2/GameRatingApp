export class Review {
    constructor(
        readonly userID: string, 
        readonly gameName: string, 
        readonly thoughtsOnGame: string, 
        readonly enjoyedGame: boolean, 
        readonly rating: number,
        readonly _id?: string,) {}
}