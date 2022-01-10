import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from '../routing/app.routing';

import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { HomeComponent } from '../components/home/home.component';
import { UserListComponent } from '../components/userlist/userlist.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { LoginComponent } from '../components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SetFocusDirective } from '../directives/setfocus.directive';
import { EditUserComponent } from '../components/edit-user/edit-user.component';
import { SharedModule } from './shared.module';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
// import { RelationshipsComponent } from '../components/relationships/relationships.component';
import { SignUpComponent } from '../components/signup/signup.component';
//import { ExperiencesViewComponent } from '../components/missions-view/missions-view.component';
import { CvViewComponent } from '../components/cv-view/cv-view.component';
import { CvConnectedUserComponent } from '../components/cv-connected-user/cv-connected-user.component';
import { CategoryListComponent } from '../components/category-list/category-list.component';
import { ConsultantsListComponent } from '../components/consultants-list/consultants-list.component';
import { ConsultantsCvManagementComponent } from '../components/consultants-cv-management/consultants-cv-management.component';
import { MyConsultantsManagementComponent, OtherConsultantsManagementComponent } from '../components/consultants-management/consultants-management.component';
import { CategoriesViewComponent } from '../components/categories-view/categories-view.component';
import { PersonalDataViewComponent } from '../components/personal-data-view/personal-data-view.component';
import { MasteringListComponent } from '../components/old/mastering-list/mastering-list.component';
import { MasteringEditRowComponent } from '../components/mastering-edit-row/mastering-edit-row.component';
import { MasteringEditFormComponent } from '../components/mastering-edit-form/mastering-edit-form.component';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule} from '@angular/material/chips';
import { SkillsManagementComponent } from '../components/skills-management/skills-management.component';
import { SkillEditComponent } from '../components/skill-edit/skill-edit.component';

import { TrainingsViewComponent } from '../components/trainings-view/trainings-view.component';
import { ExperienceCategoriesViewComponent } from '../components/experience-categories-view/experience-categories-view.component';
import { TrainingDataViewComponent } from '../components/training-data-view/training-data-view.component';
import { TrainingDataEditComponent } from '../components/training-data-edit/training-data-edit.component';

import { EnterprisesManagementComponent } from '../components/enterprises-management/enterprises-management.component';
import { EnterpriseEditComponent } from '../components/enterprise-edit/enterprise-edit.component';

import { MissionsViewComponent } from '../components/missions-view/missions-view.component';
import { MissionDataViewComponent } from '../components/mission-data-view/mission-data-view.component';
import { MissionDataEditComponent } from '../components/mission-data-edit/mission-data-edit.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        // add new component
        UserListComponent,
        LoginComponent,
        UnknownComponent,
        RestrictedComponent,
        SetFocusDirective,
        EditUserComponent,
        // RelationshipsComponent,
        SignUpComponent,
        //,ExperiencesViewComponent
        CvViewComponent,
        CvConnectedUserComponent,
        CategoryListComponent
        ,ConsultantsListComponent
        ,ConsultantsCvManagementComponent
        ,MyConsultantsManagementComponent
        ,OtherConsultantsManagementComponent
        ,CategoriesViewComponent
        ,MasteringListComponent
        ,PersonalDataViewComponent
        ,MasteringEditRowComponent
        ,MasteringEditFormComponent
        ,SkillsManagementComponent
        ,SkillEditComponent
        ,TrainingsViewComponent
        ,ExperienceCategoriesViewComponent
        ,TrainingDataViewComponent
        ,TrainingDataEditComponent
        ,EnterprisesManagementComponent
        ,EnterpriseEditComponent
        ,MissionsViewComponent
        ,MissionDataViewComponent
        ,MissionDataEditComponent

    ],
    entryComponents: [
        EditUserComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutes,
        BrowserAnimationsModule,
        SharedModule
        ,MatChipsModule
        ,MatTooltipModule
        ,MatMenuModule
        ,MatBadgeModule
        ,MatAutocompleteModule
    ],
    providers: [
        { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
              parse: {
                dateInput: ['DD/MM/YYYY'],
              },
              display: {
                dateInput: 'DD/MM/YYYY',
                monthYearLabel: 'MMM YYYY',
                dateA11yLabel: 'DD/MM/YYYY',
                monthYearA11yLabel: 'MMM YYYY',
              },
            },
          },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
