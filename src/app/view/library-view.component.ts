import { Component } from '@angular/core';

import { AssetService } from '../service';
import { Asset, asset } from '../model';

@Component({
  selector: 'ac-library',
  templateUrl: './library.html'
})
export class LibraryViewComponent {
  public assets: asset[] = [];

  constructor(private assetService: AssetService) { }

  ngOnInit() {
    this.assetService.list().subscribe(result => {
      console.log('Assets: ', result);
      this.assets = result;
    });
  }
}
