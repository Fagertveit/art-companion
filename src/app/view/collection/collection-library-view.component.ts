import { Component } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AssetService, CollectionService, NotificationService } from '../../service';
import { Asset, Collection } from '../../model';

@Component({
  selector: 'collection-library',
  templateUrl: './collection-library.html'
})
export class CollectionLibraryViewComponent {
  public collection: Collection;
  public assets: Asset[];
  public showNavigation: boolean = true;
  public showRatings: boolean = false;
  public showSelection: boolean = false;
  public filterRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetService: AssetService,
    private collectionService: CollectionService,
    private notification: NotificationService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.collectionService.get(params.get('id')).subscribe(result => {
        this.collection = result;

        this.getAssets();
      });
    });
  }

  public toggleRatings(): void {
    this.showRatings = !this.showRatings;
  }

  public toggleSelection(): void {
    this.showSelection = !this.showSelection;
  }

  public toggleNavigation(): void {
    this.showNavigation = !this.showNavigation;
  }

  public sanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public gotoImage(id: string): void {
    this.router.navigate(['image', id]);
  }

  public setRating(id: string, rating: number) {
    this.assetService.setRating(id, rating).subscribe(result => {
      this.notification.info('Rating updated!', 'Rating for the image has been updated!');
    })
  }

  public setRatingFilter(rating: number): void {
    this.filterRating = rating;
    this.getAssets();
  }

  public getAssets(): void {
    let filter = {
      $and: [
        {
          _id: {
            $in: this.collection.assets
          }
        },
        {
          rating: { $gte: this.filterRating }
        }
      ]
    };

    this.assetService.filter(filter).subscribe(result => {
      this.assets = result;
    });
  }
}
