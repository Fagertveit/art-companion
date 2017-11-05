import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardViewComponent } from './view/dashboard-view.component';
import { LibraryViewComponent } from './view/library-view.component';
import { CategoryViewComponent } from './view/category-view.component';
import { TagViewComponent } from './view/tag-view.component';
import { SettingsViewComponent } from './view/settings-view.component';
import { ImageViewComponent } from './view/image/image-view.component';
import { ImageCreateViewComponent } from './view/image/image-create-view.component';

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
    path: 'category',
    component: CategoryViewComponent
  },
  {
    path: 'tag',
    component: TagViewComponent
  },
  {
    path: 'settings',
    component: SettingsViewComponent
  },
  {
    path: 'image',
    component: ImageViewComponent,
    children: [
      {
        path: '',
        component: ImageViewComponent
      },
      {
        path: 'create',
        component: ImageCreateViewComponent
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
  ]
})
export class AppRoutingModule {}
