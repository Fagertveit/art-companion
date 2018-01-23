import { Injectable } from '@angular/core';

export interface Settings {
  libraryPath: string;
  photoshopPath: string;
}

const LS_ITEM = 'ac-settings';

@Injectable()
export class SettingsService {
  private settings: Settings = {
    libraryPath: './',
    photoshopPath: ''
  };

  constructor() { }

  public setLibraryPath(path: string): void {
    this.settings.libraryPath = path;
    this.saveSettings()
  }

  public getLibraryPath(): string {
    this.loadSettings();
    return this.settings.libraryPath;
  }

  public setPhotoshopPath(path: string): void {
    this.settings.photoshopPath = path;
    this.saveSettings();
  }

  public getPhotoshopPath(): string {
    this.loadSettings();
    return this.settings.photoshopPath;
  }

  private loadSettings(): void {
    let lsSettings = localStorage.getItem(LS_ITEM);

    if (lsSettings) {
      this.settings = JSON.parse(lsSettings);
    }
  }

  private saveSettings(): void {
    localStorage.setItem(LS_ITEM, JSON.stringify(this.settings));
  }
}
