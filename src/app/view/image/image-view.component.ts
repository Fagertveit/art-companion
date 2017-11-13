import { Component } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AssetService, TagService, CategoryService } from '../../service';
import { Asset, Category, Tag } from '../../model';

@Component({
  selector: 'ac-image-view',
  templateUrl: './image.html'
})
export class ImageViewComponent {
  public asset: Asset;
  public category: Category;
  public tags: Tag[];
  public showMetadata: boolean = false;

  constructor(
    private assetService: AssetService,
    private tagService: TagService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.asset = data[0].asset;
      this.category = data[0].category;
      this.tags = data[0].tags;
    });
  }

  public gotoCategory(category: Category): void {
    this.router.navigate(['/library', category._id]);
  }

  public toggleMetadata(): void {
    this.showMetadata = !this.showMetadata;
  }

  public sanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
