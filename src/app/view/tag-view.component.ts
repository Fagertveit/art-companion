import { Component, ViewChild } from '@angular/core';

import { Tag } from '../model';
import { TagService } from '../service';

@Component({
  selector: 'ac-tag',
  templateUrl: './tag.html'
})
export class TagViewComponent {
  public tags: Tag[] = [];

  constructor(private tagService: TagService) { }

  ngOnInit() {
    this.listTags();
  }

  public listTags(): void {
    this.tagService.list().subscribe(result => {
      this.tags = result;
    });
  }

  public removeTag(id: string): void {
    this.tagService.remove(id).subscribe(result => {
      this.listTags();
    });
  }
}
