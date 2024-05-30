import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable, afterNextRender } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { BehaviorSubject, Observable, Subscription, catchError, never, tap, throwError } from "rxjs";
import { User } from "../shared/user/user.model";
import { UserData } from "../shared/user.service";
import { Router } from "@angular/router";

export interface signUpData {
    username: string,
    password: string,
    name: string,
    email: string,
    dateOfBirth: string,
}

export interface AuthResponseData {
    user: User,
    token: string,
    expiresIn: number
}

@Injectable({providedIn: 'root'})
export class AuthService {
    userSubj = new BehaviorSubject<User>(null);
    tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {
        
    }

    signup(signupData: signUpData) {
        return this.http.post<AuthResponseData>(`${environment.API_URL}/public/signup`, 
        {
            username: signupData.username,
            password: signupData.password,
            name: signupData.name,
            email: signupData.email,
            dateOfBirth: signupData.dateOfBirth,
        })
        .pipe(
            tap(resData => this.handleAuthentication(resData)),
            catchError(this.handleError)
        )

        // return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.FirebaseKey, 
        //     {
        //         email: signupData.email,
        //         password: signupData.password,
        //         returnSecureToken: true 
        //     }
        // ).pipe(tap( resData => {
        //     const userExpirationDate = new Date(new Date().getTime() + (+resData.expiresIn) * 1000);
        //     const newUser = new User(resData.localId,  resData.email, resData.idToken, userExpirationDate);
        //     this.userSubj.next(newUser); 
        //     localStorage.setItem('user', JSON.stringify(newUser));
        //     }), 
        //     catchError(this.handleError))
    }

    login(loginData : {email: string, password: string}) {

        return this.http.post<AuthResponseData>(`${environment.API_URL}/public/login`, 
        {
            email: loginData.email,
            password: loginData.password
        })
        .pipe(
            tap(resData => this.handleAuthentication(resData)),
            catchError(this.handleError)
        )

        // return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.FirebaseKey, 
        //     {
        //         email: loginData.email,
        //         password: loginData.password,
        //         returnSecureToken: true 
        //     }
        // ).pipe(
        //     catchError(this.handleError),
        //     tap( resData => { 
        //         console.log(resData);
        //         const userExpirationDate = new Date(new Date().getTime() + (+resData.expiresIn) * 1000);
        //         const newUser = new User( resData.localId,  resData.email, resData.idToken, userExpirationDate);
        //         this.userSubj.next(newUser); 
        //         localStorage.setItem('user', JSON.stringify(newUser));
        //     })
        // )
    }

    autoLogin() {
        const userData :{
            _id: string,
            username: string,
            name: string,
            email: string,
            dateOfBirth: string,
        } = JSON.parse(localStorage.getItem('user'));
       
        const expiresIn = JSON.parse(localStorage.getItem('expiresIn'));
        if(userData){
            const user = new User(
                userData._id, 
                userData.username,
                userData.name, 
                userData.email, 
                new Date(userData.dateOfBirth)
            );
        
            console.log(expiresIn)
            if(expiresIn < 0){
                return;
            }
            this.userSubj.next(user);
            this.autoLogout();
        }
    }

    logout() {
        this.userSubj.next(null);
        this.router.navigate(['/login'])
        localStorage.removeItem('user');
        localStorage.removeItem('expiresIn');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null
    }

    autoLogout(){
        const expiresIn = JSON.parse(localStorage.getItem('expiresIn')) | 0
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expiresIn * 1000)
    }

    handleAuthentication(authData: AuthResponseData) {
        this.userSubj.next(authData.user);
        localStorage.setItem('user', JSON.stringify(authData.user));
        localStorage.setItem('expiresIn', JSON.stringify(authData.expiresIn));
        this.autoLogout();
    }

    handleError(errorRes: any) {
        console.log(errorRes);
        let errorMessage = 'an unkown error has occurred';
            if(!errorRes.error || !errorRes.error.error){
                return throwError(() => new Error(errorMessage));
            }
            switch (errorRes.error.error.message) {
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'The email you entered was not found';
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = 'The password you entered is incorrect';
                    break;
                case 'USER_DISABLED':
                    errorMessage = 'Your account has been disabled';
                    break;
                case 'INVALID_LOGIN_CREDENTIALS':
                    errorMessage = 'your email or password is incorrect';
                    break;               
            }
        return throwError(() => new Error(errorMessage));
    }
}