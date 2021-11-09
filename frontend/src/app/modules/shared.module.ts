import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
    imports: [
        MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
        MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
        MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule,
        MatSelectModule, MatCardModule, MatMomentDateModule, MatDatepickerModule
    ],
    exports: [
        MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
        MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
        MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule,
        MatSelectModule, MatCardModule, MatMomentDateModule, MatDatepickerModule
    ],
})

export class SharedModule { }
