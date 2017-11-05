import { Component, ViewChild, ApplicationRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';

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
    private applicationRef: ApplicationRef,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.on('url-activated', (event, data) => {
        let json = JSON.parse(data);
        console.log('We\'ve gotten an url from the main process', json.url);

        this.assetService.setBase64(json.imgStr);
        this.assetService.setImagePath(json.url);

        this.navigateTo('/image/create');
      });
    }
  }

  public navigateTo(route: string) {
    console.log('Navigating to:', route);

    this.router.navigate([route]);
  }
}
