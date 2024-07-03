import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../Auth/auth.service';
import { User } from '../../shared/user/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/user/user.service';
import { PopupService } from '../../shared/popup/popup.service';
import { ErrorBoxComponent } from '../../shared/errorBox/errorBox.component';
import { UiService } from '../../shared/ui.service';

@Component({
  selector: 'app-edit-pop-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, ErrorBoxComponent],
  templateUrl: './edit-pop-up.component.html',
  styleUrl: './edit-pop-up.component.css'
})
export class EditPopUpComponent implements OnInit, OnDestroy{
    editForm: FormGroup;
    currUser: User;
    errorMessage: string;
    userSub: Subscription;

    constructor(
      private authService: AuthService, 
      private userService: UserService, 
      private popupService: PopupService,
      private uiService: UiService
    ) {}

    ngOnInit(): void {
      this.userSub = this.authService.userSubj.subscribe(user => this.currUser = user);
      this.initForm();
    }

    ngOnDestroy(): void {
      if (this.userSub) {
        this.userSub.unsubscribe();
      }
    }

    initForm() {
      this.editForm = new FormGroup({
        username: new FormControl(this.currUser.username, Validators.required),
        name: new FormControl(this.currUser.name, Validators.required),
        dateOfBirth: new FormControl(this.formatDate(this.currUser.dateOfBirth), Validators.required),
      })
    }

    onSubmit(){
      if(this.editForm.valid){
        this.uiService.isLoading.next(true);
        this.userService.editAccount(
          this.currUser._id, 
          this.editForm.value.username, 
          this.editForm.value.name, 
          this.editForm.value.dateOfBirth).subscribe(
          {
            next: () => {
              this.uiService.isLoading.next(false);
              this.popupService.closePopup();
            },
            error: errorMessage => {
              this.uiService.isLoading.next(false);
              this.errorMessage = errorMessage;
            }
          })
      }
    }

    onCancel(){
      this.popupService.closePopup();
    }

    private formatDate(date: Date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    }

}
