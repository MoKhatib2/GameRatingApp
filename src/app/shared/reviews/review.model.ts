export class Review {
    constructor(
        readonly username: string, 
        readonly gameName: string, 
        readonly thoughtsOnGame: string, 
        readonly enjoyedGame: boolean, 
        readonly rating: number,
        readonly _id?: string,) {}
}