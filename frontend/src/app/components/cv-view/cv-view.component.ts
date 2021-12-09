
import { Component, AfterViewInit, Input } from '@angular/core';
import * as _ from 'lodash-es';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';
import { Mission } from 'src/app/models/mission';
import { AuthenticationService } from '../../services/authentication.service';
import { Skill } from 'src/app/models/skill';
import { Category } from 'src/app/models/category';

@Component({
    selector: 'app-cv-view',
    templateUrl: './cv-view.component.html'
})
export class CvViewComponent implements AfterViewInit {
    @Input() set getUserID(val: number) {
        this.userCvId = val;
        this.getInfoCV();
    }
    userCvId !: number;
    // missions: Mission[] = [];
    categories: Category[] = [];
    skills: Skill[] = [];
    isEditable: boolean = false;

    constructor(private userService: UserService, public authenticationService: AuthenticationService) {

    }

    ngAfterViewInit(): void {
        this.getInfoCV();
    }

    getInfoCV() {
        if (this.userCvId == null) {
            this.userCvId = this.authenticationService.currentUser?.id!;
            this.isEditable = true;
        }
        // this.userService.getMissions(this.userCvId).subscribe(missions => {
        //     this.missions = missions;
        // });
        this.userService.getCategoriesWithDetails(this.userCvId).subscribe(categories => {
            this.categories = categories;
        });

    }


}
