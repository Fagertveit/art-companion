import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AssetService } from '../../service/asset.service';
import { CategoryService } from '../../service/category.service';
import { TagService } from '../../service/tag.service';
import { category, tag, asset } from '../../model';

@Component({
  selector: 'ac-image-create-view',
  templateUrl: './image-create.html'
})
export class ImageCreateViewComponent {
  @ViewChild('img') img: HTMLImageElement;

  public url: SafeResourceUrl;
  public path: string;
  public categories: category[] = [];
  public tags: tag[] = [];
  public asset: asset = {
    url: '',
    title: '',
    tags: [],
    category: '',
    size: 0,
    dimensions: {
      width: 0,
      height: 0
    },
    monochrome: false,
    format: '',
    _id: ''
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private assetService: AssetService,
    private categoryService: CategoryService,
    private tagService: TagService
  ) { }

  ngOnInit() {
    this.path = this.assetService.getImagePath();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.assetService.getBase64());

    this.categoryService.list().subscribe(result => {
      this.categories = result;
    });

    this.tagService.list().subscribe(result => {
      this.tags = result;
    });
  }

  public saveAsset(): void {
    this.asset.dimensions.width = this.img.width;
    this.asset.dimensions.height = this.img.height;
    this.asset.format = this.path.split('.')[1];

    console.log('Save Asset:', this.asset);
  }
}
