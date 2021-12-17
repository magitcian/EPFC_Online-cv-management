import { Component} from '@angular/core';

/**
 * @title Tab group with dynamically changing tabs
 */
@Component({
  selector: 'app-my-consultants-management',
  template: `<app-consultants-cv-management [areMyConsultants]="true"></app-consultants-cv-management>`
})
export class MyConsultantsManagementComponent {

}

@Component({
  selector: 'app-other-consultants-management',
  template: `<app-consultants-cv-management [areMyConsultants]="false"></app-consultants-cv-management>`
})
export class OtherConsultantsManagementComponent {

}
