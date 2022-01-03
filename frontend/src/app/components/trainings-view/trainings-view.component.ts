import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { TrainingService } from '../../services/training.service';
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

    // isAddMode: boolean = false;

    trainings!: Training[]; 
    
    public trainingToAdd : Training = new Training();
    
    constructor(
        private userService: UserService,
        private trainingService: TrainingService,
        public dialog: MatDialog, 
        public snackBar: MatSnackBar) {
       
    }

    refresh() {
        this.userService.getTrainings(this.userCvId).subscribe(trainings => {
            this.trainings = trainings;
            this.trainingToAdd = new Training();
            console.log(this.trainings);
        });
    }

    // refresh() {
    //     console.log("test2");
    //     this.userService.getMasterings(this.userCvId).subscribe(masterings => {
    //         this.masterings = masterings;
    //         this.masteringToAdd = new Mastering();
    //         console.log(this.masterings);
    //         // console.log("testDaddy2");
    //     });
    // }

    delete(training: Training) {
        var index = this.trainings.indexOf(training);
        this.trainings.splice(index, 1);
        const snackBarRef = this.snackBar.open(`This training '${training?.title}' will be removed`, 'Undo', { duration: 3000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction) {
                this.trainingService.delete(training).subscribe();
            } 
            // else {
            //     this.refresh();
            // }
        });
        snackBarRef.onAction().subscribe(() => this.trainings.splice(index, 0, training))

    }

    update(training: Training) {
        this.trainingService.update(training).subscribe(res => { // res: ce que me renvoie le backend 
            if (!res) {
                this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 3000 });
            } else {
                this.refresh();
                this.changeEditMode();
            }            
        }); 
    }

    add(trainingToAdd: Training) {
        this.trainingService.add(trainingToAdd).subscribe(res => { // res: ce que me renvoie le backend 
            if (!res) {
                this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 3000 });
            } else {
                this.refresh();
                this.changeEditMode();
            }            
        }); 
    }

    // changeAddMode() {
    //     if (this.isEditable) {
    //         this.isAddMode = !this.isEditMode;
    //     }    
    // }

    changeEditMode() {
        if (this.isEditable) {
            this.isEditMode = !this.isEditMode;
        }
    }

}