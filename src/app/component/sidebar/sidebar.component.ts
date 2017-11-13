import { Component, Output, EventEmitter, ElementRef } from '@angular/core';

export interface Link {
  route: string;
  icon: string;
  title: string;
}

@Component({
  selector: 'ac-sidebar',
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  @Output() navigate: EventEmitter<string> = new EventEmitter<string>();
  public links: Link[] = [
    {
      route: '/',
      icon: 'fa fa-heartbeat',
      title: 'Dashboard'
    },
    {
      route: '/library',
      icon: 'fa fa-th',
      title: 'Library'
    },
    {
      route: '/image/create',
      icon: 'fa fa-picture-o',
      title: 'Image'
    }
  ]

  constructor(private el: ElementRef) { }

  public activateRoute(route: string): void {
    this.navigate.emit(route);
  }

  public toggle(): void {
    this.el.nativeElement.classList.toggle('open');
  }
}
