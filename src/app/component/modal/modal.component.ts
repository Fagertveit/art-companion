import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: './modal.html'
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() closeBtn: string = 'Close';

  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onSave: EventEmitter<boolean> = new EventEmitter<boolean>();

  private show: boolean = false;

  constructor() { }

  public open(): void {
    this.show = true;
  }

  public close(): void {
    this.onClose.emit(true);
    this.show = false;
  }

  public save(): void {
    this.onSave.emit(true);
    this.show = false;
  }
}
