import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from '../routing/app.routing';

import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { HomeComponent } from '../components/home/home.component';
import { CounterComponent } from '../components/counter/counter.component';
import { CounterStatelessComponent } from '../components/counter-stateless/counter-stateless.component';
import { CounterParentComponent } from '../components/counter-stateless/counter-parent.component';
import { FetchDataComponent } from '../components/fetch-data/fetch-data.component';
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
import { MissionsViewComponent } from '../components/missions-view/missions-view.component';
import { CvViewComponent } from '../components/cv-view/cv-view.component';
import { CvConnectedUserComponent } from '../components/cv-connected-user/cv-connected-user.component';
import { CategoryListComponent } from '../components/categorylist/categorylist.component';
import { ConsultantsListComponent } from '../components/consultants-list/consultants-list.component';
import { ConsultantsCvManagementComponent } from '../components/consultants-cv-management/consultants-cv-management.component';
import { MyConsultantsManagementComponent, OtherConsultantsManagementComponent } from '../components/consultants-management/consultants-management.component';
import { CategoriesViewComponent } from '../components/categories-view/categories-view.component';
import { MissionEditComponent } from '../components/mission-edit/mission-edit.component';
import { MasteringListComponent } from '../components/masteringlist/masteringlist.component';

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        CounterComponent,
        CounterStatelessComponent,
        CounterParentComponent,
        FetchDataComponent,
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
        MissionsViewComponent,
        CategoryListComponent
        ,ConsultantsListComponent
        ,ConsultantsCvManagementComponent
        ,MyConsultantsManagementComponent
        ,OtherConsultantsManagementComponent
        ,CategoriesViewComponent
        ,MissionEditComponent
        ,MasteringListComponent
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
