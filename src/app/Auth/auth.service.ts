import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable, afterNextRender } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { BehaviorSubject, Observable, Subscription, catchError, never, tap, throwError } from "rxjs";
import { User } from "../shared/user/user.model";
import { UserData } from "../shared/user/user.service";
import { Router } from "@angular/router";

export interface signUpData {
    username: string,
    password: string,
    name: string,
    email: string,
    dateOfBirth: string,
    image?: File
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
        const userData = new FormData();
        userData.append("username", signupData.username);
        userData.append("password", signupData.password);
        userData.append("name", signupData.name);
        userData.append("email", signupData.email);
        userData.append("dateOfBirth", signupData.dateOfBirth);
        if(signupData.image) {
            userData.append("image", signupData.image, signupData.username)
        }
        console.log(userData)

        return this.http.post<AuthResponseData>(`${environment.API_URL}/public/auth/signup`, userData)
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

        return this.http.post<AuthResponseData>(`${environment.API_URL}/public/auth/login`, 
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
        console.log('entered autoLogin')
        const userData :{
            _id: string,
            username: string,
            name: string,
            email: string,
            dateOfBirth: string,
            profileImagePath: string
        } = JSON.parse(localStorage.getItem('user'));
       
        if(userData){
            const user = new User(
                userData._id, 
                userData.username,
                userData.name, 
                userData.email, 
                new Date(userData.dateOfBirth),
                userData.profileImagePath
            );
        
            this.userSubj.next(user);
            this.autoLogout();
        }
    }

    logout() {
        this.userSubj.next(null);
        this.router.navigate(['/login']);
        localStorage.removeItem('user');
        localStorage.removeItem('expirationDate');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null
    }

    autoLogout(){
        const expirationDate = JSON.parse(localStorage.getItem('expirationDate'));
        if(!expirationDate){
            this.logout();
            return;
        }     
        const expiresIn = new Date(expirationDate).getTime() - new Date().getTime()
        if( expiresIn < 0 ){
            this.logout();
            return;
        }
        console.log(expiresIn);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expiresIn);
    }

    handleAuthentication(authData: AuthResponseData) {
        const user: User = {
            _id: authData.user._id,
            username: authData.user.username,
            name: authData.user.name,
            email: authData.user.email,
            dateOfBirth: authData.user.dateOfBirth,
            profileImagePath: authData.user.profileImagePath
        }
        this.userSubj.next(user);
        const expirationDate = new Date(new Date().getTime() + authData.expiresIn * 1000);
        localStorage.setItem('user', JSON.stringify(authData.user));
        localStorage.setItem('expirationDate', JSON.stringify(expirationDate));
        this.autoLogout();
    }

    handleError(errorRes: any) {
        console.log(errorRes);
        let errorMessage = 'an unkown error has occurred';
            console.log(errorRes.error);
            console.log(errorRes.error.error);
            if(!errorRes.error || !errorRes.error.error){
                return throwError(() => errorMessage);
            }
            switch (errorRes.error.error) {
                case 'INVALID_CREDENTIALS':
                    errorMessage = 'The email or password are incorrect.';
                    break;
                case 'USER_DISABLED':
                    errorMessage = 'Your account has been disabled';
                    break;
                case 'USERNAME_EXISTS':
                    errorMessage = 'This username already exists. Please enter a different username.';
                    break;
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email is already exists. Please enter a different email.';
                    break;
                default: 
                    errorMessage = 'An unkown error has occured.';             
            }
        return throwError(() => errorMessage);
    }
}