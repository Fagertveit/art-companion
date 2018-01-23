import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import * as PIXI from 'pixi.js';

import { Asset } from '../../model';

@Component({
  selector: 'image-renderer',
  templateUrl: './image-renderer.html'
})
export class ImageRendererComponent {
  @Input() asset: Asset;

  private renderType: string = 'WebGL';
  private app: PIXI.Application;
  private pixiCanvas: HTMLCanvasElement;
  private pixiSprite: PIXI.Sprite;
  private width: number;
  private height: number;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.width = this.el.nativeElement.offsetWidth - 320;
    this.height = this.el.nativeElement.offsetHeight;

    if (!PIXI.utils.isWebGLSupported()) {
      this.renderType = 'canvas';
    }

    PIXI.utils.sayHello(this.renderType);

    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
      transparent: true
    });

    this.pixiCanvas = this.el.nativeElement.appendChild(this.app.view);

    if (this.asset.url != '') {
      PIXI.loader.add(this.asset.url).load(() => {
        this.setupImage();
      });
    }
  }

  private setupImage(): void {
    this.pixiSprite = new PIXI.Sprite(PIXI.loader.resources[this.asset.url].texture);
    this.pixiSprite.anchor.set(0.5);
    this.pixiSprite.x = this.app.screen.width / 2;
    this.pixiSprite.y = this.app.screen.height / 2;
    this.pixiSprite.scale.set(2);

    let filter = new PIXI.filters.BlurFilter();

    this.pixiSprite.filters = [filter];

    this.app.stage.addChild(this.pixiSprite);
  }

  public fit(): void {

  }

  public resize(sidebar: boolean): void {
    this.width = this.el.nativeElement.parentElement.offsetWidth - (sidebar ? 320 : 0);
    this.height = this.el.nativeElement.parentElement.offsetHeight;
    console.log('Image renderer width and height: ', this.width, this.height);

    this.app.screen.width = this.width;
    this.app.screen.height = this.height;
    this.pixiCanvas.width = this.width;
    this.pixiCanvas.height = this.height;

    this.pixiSprite.anchor.set(0.5);
    this.pixiSprite.x = this.app.screen.width / 2;
    this.pixiSprite.y = this.app.screen.height / 2;
    this.pixiSprite.scale.set(2);

    this.app.render();
  }

  ngOnDestroy() {
    PIXI.loader.reset();
  }
}
