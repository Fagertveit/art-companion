// Core
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Third party modules
import { NgxElectronModule } from 'ngx-electron';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// Views
import { AppComponent } from './app.component';
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
import { SketchPlayerViewComponent } from './view/sketch/sketch-player-view.component';

// Component
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { FileUploadComponent } from './component/file-upload/file-upload.component';
import { ModalComponent } from './component/modal/modal.component';
import { ModalConfirmComponent } from './component/modal/modal-confirm.component';
import { ToastComponent } from './component/toast/toast.component';
import { ProgressComponent } from './component/progress/progress.component';
import { RatingComponent } from './component/rating/rating.component';
import { SketchFormComponent } from './view/sketch/sketch-form.component';
import { StatusBarComponent } from './component/status-bar/status-bar.component';
import { CoverflowComponent } from './component/coverflow/coverflow.component';

// Directive
import { DomAnchor } from './directive/dom-anchor/dom-anchor.directive';
import { TooltipDirective } from './directive/tooltip/tooltip.directive';
import { TooltipService } from './directive/tooltip/tooltip.service';
import { TooltipComponent } from './directive/tooltip/tooltip.component';

// Pipe
import { FileSizePipe } from './pipe/file-size.pipe';
import { DurationPipe } from './pipe/duration.pipe';
import { TotalTimePipe } from './pipe/total-time.pipe';

// Service
import { CategoryService } from './service/category.service';
import { TagService } from './service/tag.service';
import { AssetService } from './service/asset.service';
import { SettingsService} from './service/settings.service';
import { NotificationService } from './service/notification.service';
import { GlobalEventService } from './service/global-event.service';
import { LibraryService } from './service/library.service';
import { CollectionService } from './service/collection.service';
import { SketchService } from './service/sketch.service';
import { StatusBarService } from './service/status-bar.service';

// Routes
import { AppRoutingModule } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    DashboardViewComponent,
    LibraryViewComponent,
    SettingsViewComponent,
    ImageComponent,
    ImageViewComponent,
    ImageCreateViewComponent,
    CollectionComponent,
    CollectionListViewComponent,
    CollectionLibraryViewComponent,
    SketchComponent,
    SketchSetupViewComponent,
    SketchPlayerViewComponent,
    SidebarComponent,
    FileUploadComponent,
    ModalComponent,
    ModalConfirmComponent,
    ToastComponent,
    ProgressComponent,
    RatingComponent,
    SketchFormComponent,
    StatusBarComponent,
    CoverflowComponent,
    DomAnchor,
    TooltipDirective,
    TooltipComponent,
    FileSizePipe,
    DurationPipe,
    TotalTimePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    NgxElectronModule,
    InfiniteScrollModule
  ],
  providers: [
    TagService,
    CategoryService,
    AssetService,
    SettingsService,
    NotificationService,
    GlobalEventService,
    LibraryService,
    CollectionService,
    SketchService,
    StatusBarService,
    TooltipService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
