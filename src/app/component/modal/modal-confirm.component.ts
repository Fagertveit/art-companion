import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal-confirm',
  templateUrl: './modal-confirm.html'
})
export class ModalConfirmComponent {
  @Input() title: string = '';
  @Input() confirmBtn: string = 'Confirm';
  @Input() cancelBtn: string = 'Cancel';

  @Output() onCancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onConfirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  private show: boolean = false;

  constructor() { }

  public open(): void {
    this.show = true;
  }

  public confirm(): void {
    this.onConfirm.emit(true);
    this.show = false;
  }

  public cancel(): void {
    this.onCancel.emit(true);
    this.show = false;
  }
}
