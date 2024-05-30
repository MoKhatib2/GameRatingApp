import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { User } from "./user/user.model";

export interface UserData {
    email: string;
    name: string;
    id?: string;
    dateOfBirth: Date;
    password?: string;
}

@Injectable({providedIn: 'root'})
export class UserService{
    constructor(private http: HttpClient){}

    getUsers(){
        return this.http.get<UserData[]>(environment.FirebaseURL + '/users.json');
    }

    addUser(user: UserData){
        return this.http.put(environment.FirebaseURL + '/users/' + user.id + '.json', user);
    }
}