import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Console } from 'console';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import * as _ from 'lodash-es';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.css']
})

export class CategoryListComponent { // implements AfterViewInit, OnDestroy {
    categories: Category[] = [];

    constructor(private categoryService: CategoryService, public snackBar: MatSnackBar) {
        categoryService.getAll().subscribe(categories => {
            this.categories = categories;
        })
    }

    refresh() {
        this.categoryService.getAll().subscribe(categories => {
            this.categories = categories;
        });
    }

    spliceSev(index: number, category: Category) {
        this.categories.splice(index, 0, category); 
    }

    // ngAfterViewInit(): void {
    //     this.refresh();
    // }

    // // appelée quand on clique sur le bouton "edit" d'une catégorie
    // edit(category: Category) {
    //     const dlg = this.dialog.open(EditUserComponent, { data: { user, isNew: false } });
    //     dlg.beforeClosed().subscribe(res => {
    //         if (res) {
    //             _.assign(user, res);
    //             res = plainToClass(User, res);
    //             this.userService.update(res).subscribe(res => {
    //                 if (!res) {
    //                     this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
    //                     this.refresh();
    //                 }
    //             });
    //         }
    //     });
    // }

    
    // appelée quand on clique sur le bouton "delete" d'une catégorie
    delete(category: Category) {
        // const categoriesBackup = this.categories;
        // var isUndo = false; // boolean
        // var categoriesBackup  = _.take(this.categories, this.categories.length);
        var index = this.categories.indexOf(category);
        this.categories.splice(index, 1);
        // categoriesBackup = this.categories;
        //const backup = category; //this.dataSource.data;
        //this.dataSource.data = _.filter(this.dataSource.data, c => c.name !== category.name);
        const snackBarRef = this.snackBar.open(`Category '${category.name}' will be deleted`, 'Undo', { duration: 3000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction)
                this.categoryService.delete(category).subscribe();
            else {
                // isUndo = true;
                console.log("index : " + index);
                console.log("cat : " + category.name);
                // this.categories = categoriesBackup;
                // this.categories.splice(index, 0, category); //ne refresh pas automatiquement (faut cliquer sur edit)
                // this.spliceSev(index, category);
                // this.categories = categoriesBackup;
                this.refresh();
                console.log(this.categories);
            // else
            }
                
            //     this.dataSource.data = backup;
        });
        
    }

    // // appelée quand on clique sur le bouton "new user"
    // create() {
    //     const category = new Category();
    //     const dlg = this.dialog.open(EditUserComponent, { data: { user, isNew: true } });
    //     dlg.beforeClosed().subscribe(res => {
    //         if (res) {
    //             res = plainToClass(Category, res);
    //             this.dataSource.data = [...this.dataSource.data, res];
    //             this.userService.add(res).subscribe(res => {
    //                 if (!res) {
    //                     this.snackBar.open(`There was an error at the server. The user has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
    //                     this.refresh();
    //                 }
    //             });
    //         }
    //     });
    // }

    // ngOnDestroy(): void {
    //     this.snackBar.dismiss();
    // }

}
