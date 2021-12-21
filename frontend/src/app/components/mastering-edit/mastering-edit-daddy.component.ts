import { Component, Input, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { User, Title } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Mastering, Level } from 'src/app/models/mastering';
import { Skill } from 'src/app/models/skill';
import { Category } from 'src/app/models/category';
import { UserService } from '../../services/user.service';
import { MasteringService } from '../../services/mastering.service';
import { SkillService } from 'src/app/services/skill.service';
import { MasteringEditComponent } from '../mastering-edit/mastering-edit.component';

@Component({
    selector: 'app-mastering-edit-daddy',
    templateUrl: './mastering-edit-daddy.component.html' 
    // ,styleUrls: ['./mastering-edit-daddy.component.css']
})

export class MasteringEditDaddyComponent  {

    // @Input() set getUserID(val: number) {
    //     this.userCvId = val;
    //     this.refresh();
    // }
    // @Input() userCvId !: number;
    public userCvId = 1;
    public masterings : Mastering[] = [];
    // @Input() masterings!: Mastering[];
    // @Input() isEditable!: boolean;
    isEditMode: boolean = false;
    public isEditable: boolean = true;

    constructor(
        public snackBar: MatSnackBar,
        private masteringService: MasteringService,
        private userService: UserService
        // ,public dialog: MatDialog,
    ) {
        this.refresh();
    }

    refresh() {
        this.userService.getMasterings(this.userCvId).subscribe(masterings => {
            this.masterings = masterings;
            console.log(this.masterings);
        });
    }

    delete(mastering: Mastering) {
        var index = this.masterings.indexOf(mastering);
        this.masterings.splice(index, 1);
        const snackBarRef = this.snackBar.open(`This skill '${mastering?.skill?.name}' will be removed`, 'Undo', { duration: 5000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction) {
                this.masteringService.delete(mastering).subscribe();
            }else{
                this.refresh();
            }
        });
    }

    // update() {
    //     const data = this.frm.value;
    // }

    changeEditMode() {
        if (this.isEditable) {
            this.isEditMode = !this.isEditMode;
        }
    }


}