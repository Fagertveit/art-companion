import { Component, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { MatSidenav } from '@angular/material';

import { SidebarComponent } from './component/sidebar/sidebar.component';
import { AssetService } from './service/asset.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private router: Router,
    private electronService: ElectronService,
    private assetService: AssetService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.on('url-activated', (event, data) => {
        this.ngZone.runOutsideAngular(() => {
          console.log('We\'ve gotten an url from the main process', data.url);

          this.assetService.setBase64(data.imgStr);
          this.assetService.setImagePath(data.url);
        });

        this.ngZone.runTask(() => {
          this.navigateTo('/image/create');
        });
      });
    }
  }

  public navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
