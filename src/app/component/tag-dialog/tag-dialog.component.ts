import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'ac-tag-dialog',
  templateUrl: './tag-dialog.html',
})
export class TagDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public newTag: any
  ) { }

  close(): void {
    this.dialogRef.close();
  }
}
