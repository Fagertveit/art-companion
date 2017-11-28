import { Component, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalEventService } from './service';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public isMaximized: boolean = false;

  constructor(
    private router: Router,
    private globalEventService: GlobalEventService,
    private electron: ElectronService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.on('app-maximized', (event) => {
        this.zone.runTask(() => {
          this.isMaximized = true;
        });
      });

      this.electron.ipcRenderer.on('app-unmaximized', (event) => {
        this.zone.runTask(() => {
          this.isMaximized = false;
        });
      });
    }
  }

  public navigateTo(route: string) {
    this.router.navigate([route]);
  }

  public minimizeApp(): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.send('app-minimize-window');
    }
  }

  public maximizeApp(): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.send('app-maximize-window');
    }
  }

  public restoreApp(): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.send('app-restore-window');
    }
  }

  public quitApp(): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.send('app-quit');
    }
  }
}
