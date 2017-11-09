import { Injectable } from '@angular/core';

export interface Settings {
  libraryPath: string;
}

const LS_ITEM = 'ac-settings';

@Injectable()
export class SettingsService {
  private settings: Settings = {
    libraryPath: './'
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
