import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take, tap } from "rxjs";

import { User } from "../shared/user/user.model";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";

export const AuthGaurd : CanActivateFn = 
(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    | boolean 
    | Promise<boolean> 
    | Observable<boolean> 
    | UrlTree 
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> => {
        const authService = inject(AuthService);
        const router = inject(Router)
        return authService.userSubj.pipe(map(user => {
            console.log(user);
            if( user ){
                return true;
            }
            return router.createUrlTree(['/login']);
        }
        ))
       
        
} 

