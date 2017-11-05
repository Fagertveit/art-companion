import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';

import { Category, category } from '../model';
import { CategoryService } from './';

export class CategoryDataSource extends DataSource<category> {
  public dataChange: BehaviorSubject<category[]> = new BehaviorSubject<category[]>([]);
  get data(): category[] { return this.dataChange.value; }

  constructor(private categoryService: CategoryService) {
    super();
    this.list();
  }

  connect(): Observable<category[]> {
    return this.dataChange;
  }

  remove(id: string) {
    this.categoryService.remove(id).subscribe(numRemoved => {
      this.list();
    });
  }

  create(category: Category) {
    this.categoryService.create(category).subscribe(category => {
      this.list();
    });
  }

  list() {
    this.categoryService.list().subscribe(categories => {
      let tmpData = this.data.slice();

      tmpData = [...categories];
      this.dataChange.next(tmpData);
    })
  }

  disconnect() { }
}
