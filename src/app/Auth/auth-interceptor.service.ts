import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, exhaustMap, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.userSubj.pipe(
            take(1), 
            exhaustMap(user => {
                // console.log(user);
                // if(!user){
                //     return next.handle(req);
                // }
                // const modifiedReq = req.clone({params: new HttpParams().set('auth', user.userToken)});
                return next.handle(req);
            }))
    }
    
}