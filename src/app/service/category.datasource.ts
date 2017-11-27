import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Category } from '../model';
import { CategoryService } from './category.service';

@Injectable()
export class CategoryDatasource {
  private dataChange: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);

  constructor(private categoryService: CategoryService) { }

  public connect(): Observable<Category[]> {
    return this.dataChange;
  }

  public list(): void {
    let listData: Category[];

    this.categoryService.list().subscribe(result => {
      listData = result;
      this.dataChange.next(result);
    });
  }

  public remove(id: string): void {
    this.categoryService.remove(id).subscribe(result => {
      this.list();
    });
  }

  public create(category: Category): void {
    this.categoryService.create(category).subscribe(result => {
      this.list();
    });
  }

  public disconnect() {

  }
}
