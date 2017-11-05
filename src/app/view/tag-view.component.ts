import { Component, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';

import { Tag, tag } from '../model';
import { TagService } from '../service';
import { TagDataSource } from '../service/tag.datasource';

import { TagDialogComponent } from '../component/tag-dialog/tag-dialog.component';

@Component({
  selector: 'ac-tag',
  templateUrl: './tag.html'
})
export class TagViewComponent {
  public tags: TagDataSource;

  constructor(private tagService: TagService, public dialog: MatDialog) { }

  ngOnInit() {
    this.tags = new TagDataSource(this.tagService);
  }

  public removeTag(id: string): void {
    this.tags.remove(id);
  }

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
}
