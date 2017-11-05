import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'file-upload',
    templateUrl: './file-upload.html'
})
export class FileUploadComponent {
  @Output() url: EventEmitter<string> = new EventEmitter<string>();
  @Output() image: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  public fileChange(event: any): void {
    let files: FileList = event.srcElement.files;
    let file: File = files[0];
    console.log('Uploading file: ', file);
    let fileReader: FileReader = new FileReader();

    fileReader.onload = () => {
      this.image.emit(fileReader.result);
      this.url.emit(file.path);
    }

    fileReader.readAsDataURL(file);
  }
}
