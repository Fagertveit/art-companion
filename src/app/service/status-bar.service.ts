import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class StatusBarService {
  private libraryCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private areaCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private hidden: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() { }

  public getHidden(): Observable<boolean> {
    return this.hidden.asObservable();
  }

  public setHidden(hidden: boolean): void {
    this.hidden.next(hidden);
  }

  public getLibraryCount(): Observable<number> {
    return this.libraryCount.asObservable();
  }

  public setLibraryCount(count: number): void {
    this.libraryCount.next(count);
  }

  public getAreaCount(): Observable<number> {
    return this.areaCount.asObservable();
  }

  public setAreaCount(count: number): void {
    this.areaCount.next(count);
  }
}
