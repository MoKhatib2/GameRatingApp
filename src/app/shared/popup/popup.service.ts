import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog) { }

  openPopup(component: any) {
    this.dialog.open(component);
  }

  closePopup() {
    this.dialog.closeAll();
  }

 
}
