import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService, signUpData } from "../auth.service";
import { Router, RouterModule } from "@angular/router";
import { UserService } from "../../shared/user.service";
import { CommonModule } from "@angular/common";

@Component({
    standalone: true,
    selector: 'app-signup',
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit, OnDestroy{
    signupForm? : FormGroup;
    signupSubscription : Subscription;
    addUserSubscription : Subscription;

    constructor(private authService: AuthService, private userService: UserService, private router: Router){}

    ngOnInit(): void {
        this.initForm();
    }

    ngOnDestroy(): void {
        if(this.signupSubscription){
            this.signupSubscription.unsubscribe();
        }
        if(this.addUserSubscription){
            this.addUserSubscription.unsubscribe();
        }
    }

    initForm() {
        this.signupForm = new FormGroup({
            'username': new FormControl('', Validators.required),
            'name': new FormControl('', Validators.required),
            'dateOfBirth': new FormControl('', Validators.required),
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', Validators.required)
        });
    }

    onSubmit(){
        if(!this.signupForm.valid){
            console.log('wrong credentials');
            return;
        }
    console.log(this.signupForm)
    
    const signupData: signUpData = {
        username: this.signupForm.get('username').value,
        email: this.signupForm.get('email').value,
        password: this.signupForm.get('password').value,
        name: this.signupForm.get('name').value,
        dateOfBirth: this.signupForm.get('dateOfBirth').value
    }
    let signupSuccess = false;
    let id = '';
    this.signupSubscription = this.authService.signup(signupData)
        .subscribe({
            next: resData => {
                signupSuccess = true;
                this.router.navigate(['/']);
                // id = resData.localId;
            }, 
            error: erroMessage => {
                console.log(erroMessage)
            },
            complete: () => {
                if(signupSuccess) {
                    console.log('entered here')
                    // this.addUserSubscription = this.userService.addUser({id : id, ...signupData})
                    //     .subscribe({next: res => this.router.navigate(['/']), error: e => console.log(e)});  
                }
            }
        })
    }
}