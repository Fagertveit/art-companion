import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// Views
import { AppComponent } from './app.component';
import { DashboardViewComponent } from './view/dashboard-view.component';
import { LibraryViewComponent } from './view/library-view.component';
import { CategoryViewComponent } from './view/category-view.component';
import { TagViewComponent } from './view/tag-view.component';
import { SettingsViewComponent } from './view/settings-view.component';
import { ImageComponent } from './view/image/image.component';
import { ImageViewComponent } from './view/image/image-view.component';
import { ImageCreateViewComponent } from './view/image/image-create-view.component';

// Component
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { FileUploadComponent } from './component/file-upload/file-upload.component';
import { ModalComponent } from './component/modal/modal.component';
import { ToastComponent } from './component/toast/toast.component';

// Directive
import { DomAnchor } from './directive/dom-anchor/dom-anchor.directive';

// Service
import { CategoryService } from './service/category.service';
import { TagService } from './service/tag.service';
import { AssetService } from './service/asset.service';
import { SettingsService} from './service/settings.service';
import { NotificationService } from './service/notification.service';

import { AppRoutingModule } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    DashboardViewComponent,
    LibraryViewComponent,
    CategoryViewComponent,
    TagViewComponent,
    SettingsViewComponent,
    ImageComponent,
    ImageViewComponent,
    ImageCreateViewComponent,
    SidebarComponent,
    FileUploadComponent,
    ModalComponent,
    ToastComponent,
    DomAnchor
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    NgxElectronModule,
    InfiniteScrollModule
  ],
  providers: [TagService, CategoryService, AssetService, SettingsService, NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
