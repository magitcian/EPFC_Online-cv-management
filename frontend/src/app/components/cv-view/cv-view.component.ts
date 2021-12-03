
import { Component, AfterViewInit, Input } from '@angular/core';
import * as _ from 'lodash-es';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';
import { Mission } from 'src/app/models/mission';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'app-cv-view',
    templateUrl: './cv-view.component.html'
})
export class CvViewComponent implements AfterViewInit {
    @Input() userCV!: User;

    missions: Mission[] = [];

    constructor(private userService: UserService, public authenticationService: AuthenticationService) {

    }

    ngAfterViewInit(): void {
        this.getInfoCV();
    }

    getInfoCV() {
        var user = this.authenticationService.currentUser;
        if (user != null) {
            this.userService.getMissions(user.id).subscribe(missions => {
                this.missions = missions;
            });
        }
    }
}
