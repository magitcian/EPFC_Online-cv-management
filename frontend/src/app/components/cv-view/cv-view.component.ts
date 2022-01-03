
import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';
import * as _ from 'lodash-es';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';
import { Mission } from 'src/app/models/mission';
import { AuthenticationService } from '../../services/authentication.service';
import { Skill } from 'src/app/models/skill';
import { Category } from 'src/app/models/category';
import { Mastering } from 'src/app/models/mastering';

@Component({
    selector: 'app-cv-view',
    templateUrl: './cv-view.component.html',
    styleUrls: ['./cv-view.component.css']
})
export class CvViewComponent {
    @Input() set getUserID(val: number) {
        this.userCvId = val;
    }
    userCvId !: number;
    @Input() isEditable!: boolean;

    constructor(
        // private userService: UserService, 
        public authenticationService: AuthenticationService) {
        
    }


}
