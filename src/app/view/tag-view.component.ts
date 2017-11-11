import { Component, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';

import { Tag } from '../model';
import { TagService } from '../service';

import { TagDialogComponent } from '../component/tag-dialog/tag-dialog.component';

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
  /*
  openDialog(): void {
    let dialogRef = this.dialog.open(TagDialogComponent, {
      width: '250px',
      data: { title: '', description: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        let tag: Tag = new Tag(result.title, result.description);
        this.tags.create(tag);
      }
    });
  }
  */
}
