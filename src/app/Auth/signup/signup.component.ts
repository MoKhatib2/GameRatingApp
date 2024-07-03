import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService, signUpData } from "../auth.service";
import { Router, RouterModule } from "@angular/router";
import { UserService } from "../../shared/user/user.service";
import { CommonModule } from "@angular/common";
import { ErrorBoxComponent } from "../../shared/errorBox/errorBox.component";
import { UiService } from "../../shared/ui.service";

@Component({
    standalone: true,
    selector: 'app-signup',
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ErrorBoxComponent],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
    signupForm? : FormGroup;
    imageData: string;
    errorMessage?: string;
    loading: boolean = false;
    signupSubscription : Subscription;
    addUserSubscription : Subscription;

    constructor(private authService: AuthService, private userService: UserService, private uiService: UiService,private router: Router){}

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
        //const StrongPasswordRegx: RegExp =  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
        const passwordRegx: RegExp = /.{8,}/;
        this.signupForm = new FormGroup({
            'username': new FormControl('', Validators.required),
            'name': new FormControl('', Validators.required),
            'dateOfBirth': new FormControl('', Validators.required),
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', [Validators.required, Validators.pattern(passwordRegx)]),
            'profileImage': new FormControl(null)
        });
    }

    onSubmit(){
        this.errorMessage = null;
        if(!this.signupForm.valid){
            console.log('wrong credentials');
            return;
        }
        console.log(this.signupForm)
        
        this.uiService.isLoading.next(true);
        const signupData: signUpData = {
            username: this.signupForm.get('username').value,
            email: this.signupForm.get('email').value,
            password: this.signupForm.get('password').value,
            name: this.signupForm.get('name').value,
            dateOfBirth: this.signupForm.get('dateOfBirth').value,
            image: this.signupForm.get('profileImage').value
        }
        let signupSuccess = false;
        let id = '';
        this.signupSubscription = this.authService.signup(signupData)
            .subscribe({
                next: resData => {
                    this.imageData = resData.user.profileImagePath;
                    this.router.navigate(['/']);
                    // id = resData.localId;
                }, 
                error: erroMessage => {
                    this.errorMessage = erroMessage;
                    this.uiService.isLoading.next(false);
                },
                complete: () => {
                    this.uiService.isLoading.next(false);
                }
            })
    }

    onFileSelect(event: Event){
        console.log((event.target as HTMLInputElement).files[0]);
        const file = (event.target as HTMLInputElement).files[0];
        const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
        this.signupForm.patchValue({'profileImage': file});
        if (file && allowedMimeTypes.includes(file.type)) {
            const reader = new FileReader();
            reader.onload = () => {
                this.imageData = reader.result as string;
                console.log(this.imageData)
            }
            reader.readAsDataURL(file);
        }
    }

}