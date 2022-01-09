import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Training } from 'src/app/models/training';
import { Enterprise } from 'src/app/models/enterprise';
import { Skill } from 'src/app/models/skill';
import { Using } from 'src/app/models/using';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash-es';

@Component({
    selector: 'app-training-data-view', 
    templateUrl: './training-data-view.component.html',
    styleUrls: ['./training-data-view.component.css']
})

export class TrainingDataViewComponent {

    @Input() set getTraining(val: Training) {
        this.training = val;
    }
    @Input() isEditable!: boolean;
    @Input() isNew!: boolean;
    
    training!: Training;
    experienceId!: number;
    isUpdateMode: boolean = false;
    enterprises!: Enterprise[];
    skills!: Skill[];
    usings!: Using[];

    @Output() deleteTrainingInDaddy: EventEmitter<void> = new EventEmitter<void>(); 
    @Output() updateTrainingInDaddy: EventEmitter<Training> = new EventEmitter<Training>(); 

    constructor(
        public dialog: MatDialog, 
        public snackBar: MatSnackBar) {
       
    }

    update(training: Training) { 
        this.updateTrainingInDaddy.emit(training); // res est un EventEmitter et celui-ci va être transformé en Training
    }

    delete() {
        this.deleteTrainingInDaddy.emit();
    }

    changeUpdateMode() {
        if (this.isEditable) {
            this.isUpdateMode = !this.isUpdateMode;
        }
    }

}