import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router, RouterModule } from "@angular/router";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, CommonModule],
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy{
    loginForm? : FormGroup;
    loginSubscription : Subscription;
    errorMessage: string;

    constructor(private authService: AuthService, private router: Router){}

    ngOnInit(): void {
        this.initForm();
    }

    ngOnDestroy(): void {
        if(this.loginSubscription){
            this.loginSubscription.unsubscribe();
        }
    }

    initForm() {
        this.loginForm = new FormGroup({
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', Validators.required)
        });
    }

    onSubmit(){
        if(!this.loginForm.valid){
            console.log('wrong credentials');
            return;
        }
    console.log(this.loginForm)
    
    const loginData = {
        email: this.loginForm.get('email').value,
        password: this.loginForm.get('password').value
    }
    this.loginSubscription = this.authService.login(loginData)
        .subscribe({
            next: resData => {
                console.log(resData);
                this.router.navigate(['/']);
            },
            error: message => {
                this.errorMessage = message
            }
        })
    }
}