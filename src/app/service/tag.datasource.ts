import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';

import { Tag, tag } from '../model';
import { TagService } from './';

export class TagDataSource extends DataSource<tag> {
  public dataChange: BehaviorSubject<tag[]> = new BehaviorSubject<tag[]>([]);
  get data(): tag[] { return this.dataChange.value; }

  constructor(private tagService: TagService) {
    super();
    this.list();
  }

  connect(): Observable<tag[]> {
    return this.dataChange;
  }

  remove(id: string) {
    this.tagService.remove(id).subscribe(numRemoved => {
      this.list();
    });
  }

  create(tag: Tag) {
    this.tagService.create(tag).subscribe(tag => {
      this.list();
    });
  }

  list() {
    this.tagService.list().subscribe(tags => {
      let tmpData = this.data.slice();

      tmpData = [...tags];
      this.dataChange.next(tmpData);
    })
  }

  disconnect() { }
}
