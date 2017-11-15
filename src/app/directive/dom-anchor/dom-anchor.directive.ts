import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dom-anchor]'
})
export class DomAnchor {
  // We give the directive a public member for getting access to the DOM
  constructor(public viewContainerRef: ViewContainerRef) { }
}
