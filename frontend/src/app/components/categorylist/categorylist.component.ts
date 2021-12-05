import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'app-categorylist',
    templateUrl: './categorylist.component.html'
})
export class CategoryListComponent {
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
        //const backup = category; //this.dataSource.data;
        //this.dataSource.data = _.filter(this.dataSource.data, c => c.name !== category.name);
        const snackBarRef = this.snackBar.open(`Category '${category.name}' will be deleted`, 'Undo', { duration: 10000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction)
                this.categoryService.delete(category).subscribe();
            // else
            //     this.dataSource.data = backup;
        });
        this.refresh(); // TODO: ça ne fonctionne pas !
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

}
