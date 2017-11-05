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
  @ViewChild('sidenav') sidenav: MatSidenav;

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
          let json = JSON.parse(data);
          console.log('We\'ve gotten an url from the main process', json.url);

          this.assetService.setBase64(json.imgStr);
          this.assetService.setImagePath(json.url);
        });

        this.ngZone.runTask(() => {
          this.navigateTo('/image/create');
        });
      });
    }
  }

  public navigateTo(route: string) {
    this.sidenav.close();

    this.router.navigate([route]);
  }
}
