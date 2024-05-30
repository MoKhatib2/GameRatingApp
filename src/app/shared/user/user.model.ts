export class User {
    constructor(
        readonly _id: string,
        readonly username: string,
        readonly name: string,
        readonly email: string,
        readonly dateOfBirth: Date,
        ){}
 
}