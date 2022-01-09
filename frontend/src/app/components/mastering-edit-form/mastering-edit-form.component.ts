import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { User, Title } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Mastering, Level } from 'src/app/models/mastering';
import { Skill } from 'src/app/models/skill';
import { Experience } from 'src/app/models/experience';
import { UserService } from '../../services/user.service';
import { MasteringService } from '../../services/mastering.service';
import { SkillService } from 'src/app/services/skill.service';
import { ExperienceService } from 'src/app/services/experience.service';
import { MasteringEditRowComponent } from '../mastering-edit-row/mastering-edit-row.component';
import { compileInjectable } from '@angular/compiler';

@Component({
    selector: 'app-mastering-edit-form',
    templateUrl: './mastering-edit-form.component.html' 
    ,styleUrls: ['./mastering-edit-form.component.css']
})

export class MasteringEditFormComponent  {

    @Input() set getUserID(val: number) {
        this.userCvId = val;
        this.refresh();
    }

    @Output() refreshInDaddy: EventEmitter<void> = new EventEmitter<void>(); 

    userCvId !: number;
    public masterings : Mastering[] = [];
    isEditMode: boolean = false;
    public isEditable: boolean = true;
    public masteringToAdd : Mastering = new Mastering();
    public skill!: Skill;
    public experience!: Experience;

    constructor(
        public snackBar: MatSnackBar,
        private masteringService: MasteringService,
        private userService: UserService
    ) {
        // this.refresh(); // error bc it starts there (before input) and at this stage, it does not have the userCvId !
    }

    refresh() {
        this.userService.getMasterings(this.userCvId).subscribe(masterings => {
            this.masterings = masterings;
            //this.masteringToAdd = new Mastering();
            console.log(this.masterings);
            // console.log("testDaddy2");
        });
    }

    refreshMastering(mastering: Mastering) {
        console.log("testDaddy");
        this.userService.getMasterings(this.userCvId).subscribe(masterings => {
            this.masterings = masterings;
            console.log(this.masterings);
            console.log("testDaddy2");
        });
    }

    add(mastering: Mastering) {
        this.masteringService.add(mastering).subscribe(res => { // res: ce que me renvoie le backend 
            if (!res) {
                this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 3000 });
                // console.log(res.valueOf());
            } else {
                this.refresh();
                this.refreshInDaddy.emit();
                // console.log("test1");
            }            
        }); 
    }

    delete(mastering: Mastering) {
        var index = this.masterings.indexOf(mastering);
        this.masterings.splice(index, 1);
        const snackBarRef = this.snackBar.open(`This skill '${mastering?.skill?.name}' will be removed`, 'Undo', { duration: 3000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction) {
                this.masteringService.delete(mastering).subscribe(res => {
                    this.refresh();
                    this.refreshInDaddy.emit();
                });
            }
        });
        snackBarRef.onAction().subscribe(() => this.masterings.splice(index, 0, mastering));
    }

    update(mastering: Mastering) {
        this.masteringService.update(mastering).subscribe(res => { // res: ce que me renvoie le backend 
            if (!res) {
                this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 3000 });
            } else {
                this.refresh();
                this.refreshInDaddy.emit();
                // console.log("test1");
            }            
        });
    }

    changeEditMode() {
        if (this.isEditable) {
            this.isEditMode = !this.isEditMode;
        }
    }

}

    // _.assign(mastering, res);    // dit que le res est formaté comme un mastering (il faut le repréciser)
    // res = plainToClass(Mastering, res);  // res n'a rien à voir avec le res qui m'intéresse - que pour savoir si l'util a cliqué sur undo ou pas

    // add(mastering: Mastering) {
    //     if (mastering.level == 3 && this.getDurationOfSkillExperiences(mastering) < 730) {
    //         console.log(this.getDurationOfSkillExperiences(mastering));
    //         const snackBarRef = this.snackBar.open(`This skill was developed less than 2 years in your experiences. Are you sure you are "Medior"?`, 'Yes', { duration: 5000 });
    //         snackBarRef.onAction().subscribe(() => this.addMasteringService(mastering));        
    //     } 
    //     else if (mastering.level == 4 && this.getDurationOfSkillExperiences(mastering) < 1460) {
    //         const snackBarRef = this.snackBar.open(`This skill was developed less than 4 years in your experiences. Are you sure you are "Senior"?`, 'Yes', { duration: 5000 });
    //         snackBarRef.onAction().subscribe(() => this.addMasteringService(mastering));        
    //     } 
    //     else if (mastering.level == 5 && this.getDurationOfSkillExperiences(mastering) < 2190) {
    //         const snackBarRef = this.snackBar.open(`This skill was developed less than 6 years in your experiences. Are you sure you are "Expert"?`, 'Yes', { duration: 5000 });
    //         snackBarRef.onAction().subscribe(() => this.addMasteringService(mastering));        
    //     } else {
    //         this.addMasteringService(mastering);
    //     }    
    // }