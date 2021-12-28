import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { Training } from 'src/app/models/training';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-trainings-view', 
    templateUrl: './trainings-view.component.html',
    styleUrls: ['./trainings-view.component.css']
})

export class TrainingsViewComponent {
    @Input() set getUserID(val: number) {
        this.userCvId = val;
        this.refresh();
    }
    @Input() isEditable!: boolean;

    userCvId!: number;

    isEditMode: boolean = false;

    trainings!: Training[]; 
    
    constructor(
        private userService: UserService,
        public dialog: MatDialog, 
        public snackBar: MatSnackBar) {
       
    }

    refresh() {
        this.userService.getTrainings(this.userCvId).subscribe(trainings => {
            this.trainings = trainings;
            console.log(this.trainings);
        });
    }

    changeEditMode() {
        if (this.isEditable) {
            this.isEditMode = !this.isEditMode;
        }
    }

}