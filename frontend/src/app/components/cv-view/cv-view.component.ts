
import { CV } from 'src/app/models/cv';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { UserService } from '../../services/user.service';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { plainToClass } from 'class-transformer';
import { User } from 'src/app/models/user';
import { Experience } from 'src/app/models/experience';

@Component({
    selector: 'app-cv-view',
    templateUrl: './cv-view.component.html'
})
export class CvViewComponent implements AfterViewInit {
    //TODO questions : pourquoi ne semble pas transmettre les experiences au composant enfant?
    // le display ne fonctionne pas non plus
    experiences: Experience[] = [];

    constructor(private userService: UserService) {
        this.userService.getCV(4).subscribe(user => {
            this.experiences = user?.experiences;

        });
    }

    ngAfterViewInit(): void {
        this.refresh();
    }

    refresh() {

        this.userService.getCV(4).subscribe(user => {
            this.experiences = user?.experiences;

        });
    }

}
