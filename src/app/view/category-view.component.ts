import { Component } from '@angular/core';

import { CategoryService } from '../service/category.service';
import { Category } from '../model';

import { CategoryDialogComponent } from '../component/category-dialog/category-dialog.component';

@Component({
  selector: 'ac-category',
  templateUrl: './category.html'
})
export class CategoryViewComponent {
  public categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.listCategories();
  }

  public listCategories(): void {
    this.categoryService.list().subscribe(result => {
      this.categories = result;
    });
  }

  public removeCategory(id: string): void {
    this.categoryService.remove(id).subscribe(result => {
      this.listCategories();
    });
  }
  /*
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
  */
}
