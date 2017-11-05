import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CategoryDataSource } from '../service/category.datasource';
import { CategoryService } from '../service/category.service';
import { Category, category } from '../model';

import { CategoryDialogComponent } from '../component/category-dialog/category-dialog.component';

@Component({
  selector: 'ac-category',
  templateUrl: './category.html'
})
export class CategoryViewComponent {
  public categories: CategoryDataSource;

  constructor(private categoryService: CategoryService, public dialog: MatDialog) { }

  ngOnInit() {
    this.categories = new CategoryDataSource(this.categoryService);
  }

  public removeCategory(id: string): void {
    this.categories.remove(id);
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '250px',
      data: { title: '', description: '', icon: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        let category: Category = new Category(result.title, result.description);
        this.categories.create(category);
      }
    });
  }
}
