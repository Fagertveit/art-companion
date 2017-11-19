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
      icon: 'dashboard',
      title: 'Dashboard'
    },
    {
      route: '/library',
      icon: 'view_quilt',
      title: 'Library'
    },
    {
      route: '/image/create',
      icon: 'save',
      title: 'Add Image'
    },
    {
      route: '/collection',
      icon: 'collections',
      title: 'Collections'
    },
    {
      route: '/sketch',
      icon: 'gesture',
      title: 'Sketch Tool'
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
