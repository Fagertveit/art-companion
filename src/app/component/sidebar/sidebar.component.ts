import { Component, Output, EventEmitter } from '@angular/core';

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
      icon: 'photo library',
      title: 'Library'
    },
    {
      route: '/category',
      icon: 'list',
      title: 'Categories'
    },
    {
      route: '/tag',
      icon: 'list',
      title: 'Tags',
    },
    {
      route: '/image/create',
      icon: 'list',
      title: 'Image'
    }
  ]

  constructor() { }

  public activateRoute(route: string): void {
    this.navigate.emit(route);
  }
}
