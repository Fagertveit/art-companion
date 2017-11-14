import { Component, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';

import { SidebarComponent } from './component/sidebar/sidebar.component';
import { AssetService, SettingsService } from './service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private router: Router,
    private electronService: ElectronService,
    private assetService: AssetService,
    private settingsService: SettingsService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.on('import-resource', (event, data) => {
        this.ngZone.runOutsideAngular(() => {
          console.log('We\'ve gotten an url from the main process', data.url);

          this.assetService.setImportedData(data);
        });

        this.ngZone.runTask(() => {
          this.navigateTo('/image/create');
        });
      });

      if (this.settingsService.getLibraryPath()) {
        this.electronService.ipcRenderer.send('client-startup', { libraryPath: this.settingsService.getLibraryPath() });
      }
    }
  }

  public navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
