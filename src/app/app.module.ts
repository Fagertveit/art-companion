import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatSidenavModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatTableModule,
  MatListModule,
  MatTooltipModule,
  MatDialogModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatStepperModule,
  MatGridListModule,
  MatChipsModule,
  MatCheckboxModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { NgxElectronModule } from 'ngx-electron';

import 'hammerjs';

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
import { TagDialogComponent } from './component/tag-dialog/tag-dialog.component';
import { CategoryDialogComponent } from './component/category-dialog/category-dialog.component';
import { FileUploadComponent } from './component/file-upload/file-upload.component';

// Service
import { CategoryService } from './service/category.service';
import { TagService } from './service/tag.service';
import { AssetService } from './service/asset.service';
import { SettingsService} from './service/settings.service';

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
    TagDialogComponent,
    CategoryDialogComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatStepperModule,
    MatGridListModule,
    MatChipsModule,
    CdkTableModule,
    NgxElectronModule
  ],
  entryComponents: [TagDialogComponent, CategoryDialogComponent],
  providers: [TagService, CategoryService, AssetService, SettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
