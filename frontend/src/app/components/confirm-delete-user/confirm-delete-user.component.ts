import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { Inject } from '@angular/core';

/**
 * @title Tab group with dynamically changing tabs
 */
@Component({
  selector: 'app-confirm-delete-user',
  templateUrl: 'confirm-delete-user.component.html'
})
export class ConfirmDeleteUserComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteUserComponent>, @Inject(MAT_DIALOG_DATA) public data: {},) {}

  toDelete(isToDelete : Boolean){
    const data = isToDelete;
    this.dialogRef.close(data);
  }
}