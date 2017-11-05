import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'ac-category-dialog',
  templateUrl: './category-dialog.html',
})
export class CategoryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public newCategory: any
  ) { }

  close(): void {
    this.dialogRef.close();
  }
}
