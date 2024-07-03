import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { User } from '../shared/user/user.model';
import { UserService } from '../shared/user/user.service';
import { EditPopUpComponent } from './edit-pop-up/edit-pop-up.component';
import { PopupService } from '../shared/popup/popup.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy{
  currUser: User;
  currUserEmail: string;
  defaultProfileImagePath: string = '../../assets/images/profileImage.png';
  faEdit = faEdit;
  faTrash = faTrash;
  userSub: Subscription;
  deleteAccountSub: Subscription;

  constructor(private authService: AuthService, private userService: UserService, private popupService: PopupService) {}

  ngOnInit(): void {
    this.userSub = this.authService.userSubj.subscribe( user => {
      console.log(user)
      this.currUser = user;
      this.currUserEmail = user.email;
    })
  }

  ngOnDestroy() {
    if(this.userSub){
      this.userSub.unsubscribe();
    }

    if(this.deleteAccountSub) {
      this.deleteAccountSub.unsubscribe();
    }
  }
  
  onDeleteAccount() {
    this.userService.deleteAccount(this.currUser._id).subscribe(() => this.authService.logout());
  }

  onEditAccount() {
    this.popupService.openPopup(EditPopUpComponent);
  }

}
