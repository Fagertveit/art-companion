import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardViewComponent } from './view/dashboard-view.component';
import { LibraryViewComponent } from './view/library-view.component';
import { SettingsViewComponent } from './view/settings-view.component';
import { ImageComponent } from './view/image/image.component';
import { ImageViewComponent } from './view/image/image-view.component';
import { ImageCreateViewComponent } from './view/image/image-create-view.component';
import { CollectionComponent } from './view/collection/collection.component';
import { CollectionListViewComponent } from './view/collection/collection-list-view.component';
import { CollectionLibraryViewComponent } from './view/collection/collection-library-view.component';
import { SketchComponent } from './view/sketch/sketch.component';
import { SketchSetupViewComponent } from './view/sketch/sketch-setup-view.component';

import { ImageCreateResolve } from './view/image/image-create.resolve';
import { ImageViewResolve } from './view/image/image-view.resolve';

const appRoutes: Routes = [
  {
    path: '',
    component: DashboardViewComponent
  },
  {
    path: 'library',
    component: LibraryViewComponent
  },
  {
    path: 'library/:id',
    component: LibraryViewComponent
  },
  {
    path: 'settings',
    component: SettingsViewComponent
  },
  {
    path: 'image',
    component: ImageComponent,
    children: [
      {
        path: 'create',
        resolve: [ImageCreateResolve],
        component: ImageCreateViewComponent
      },
      {
        path: ':id',
        resolve: [ImageViewResolve],
        component: ImageViewComponent
      }
    ]
  },
  {
    path: 'collection',
    component: CollectionComponent,
    children: [
      {
        path: '',
        component: CollectionListViewComponent
      },
      {
        path: ':id',
        component: CollectionLibraryViewComponent
      }
    ]
  },
  {
    path: 'sketch',
    component: SketchComponent,
    children: [
      {
        path: '',
        component: SketchSetupViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [
    RouterModule
  ],
  providers: [
    ImageCreateResolve,
    ImageViewResolve
  ]
})
export class AppRoutingModule {}
