import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { User } from "./user.model";
import { catchError, map, tap, throwError } from "rxjs";
import { AuthService } from "../../Auth/auth.service";

export interface UserData {
    email: string;
    name: string;
    id?: string;
    dateOfBirth: Date;
    password?: string;
}

@Injectable({providedIn: 'root'})
export class UserService{
    constructor(private http: HttpClient, private authService: AuthService){}

    getUsers(){
        return this.http.get<UserData[]>(environment.FirebaseURL + '/users.json');
    }

    addUser(user: UserData){
        return this.http.put(environment.FirebaseURL + '/users/' + user.id + '.json', user);
    }

    getUsersByReviewedGame(gameName: string) {
        return this.http.get<{users: User[]}>(`${environment.API_URL}/private/users/getUsersByReviewedGame/${gameName}`)
            .pipe(map(res => {
                return res.users;
            }));
    }

    editAccount(_id: string, username: string, name: string, dateOfBirth: Date) {
        return this.http.put<User>(`${environment.API_URL}/private/users/editAccount/${_id}`, {username, name, dateOfBirth})
            .pipe(
                tap(user => {
                    this.authService.userSubj.next(user);
                    localStorage.setItem('user', JSON.stringify(user));
                }),
                catchError(errorRes => {
                let errorMessage = "An unkown error has occured."
                if(!errorRes.error || !errorRes.error.error) {
                    return throwError(() => errorMessage);
                }
                switch(errorRes.error.error) {
                    case 'USERNAME_EXISTS':
                        errorMessage = "This username is taken.";
                        break;
                }
                return throwError(() => errorMessage);
            }))
    }

    deleteAccount(_id: string) {
        return this.http.delete(`${environment.API_URL}/private/users/deleteAccount/${_id}`);
    }
}