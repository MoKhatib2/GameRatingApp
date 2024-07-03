import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router, RouterModule } from "@angular/router";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { ErrorBoxComponent } from "../../shared/errorBox/errorBox.component";
import { UiService } from "../../shared/ui.service";

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, CommonModule, ErrorBoxComponent],
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
    loginForm? : FormGroup;
    loginSubscription : Subscription;
    errorMessage?: string;
    loading: boolean = false;

    constructor(private authService: AuthService, private router: Router, private uiService: UiService){}

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
        this.errorMessage = null;
        if(!this.loginForm.valid){
            console.log('wrong credentials');
            return;
        }
        console.log(this.loginForm)
    
        this.uiService.isLoading.next(true);
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
                error: errorMessage => {
                    this.errorMessage = errorMessage;
                    this.uiService.isLoading.next(false);
                },
                complete: () => this.uiService.isLoading.next(false)
            })
        }
}