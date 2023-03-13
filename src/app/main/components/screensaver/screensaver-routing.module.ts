import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendUserAlertComponent } from '../wallpaper/send-user-alert/send-user-alert.component';
import { ScreensaverListComponent } from './components/screensaver-list.component';
import { CreateScreensaverComponent } from './create-screensaver/create-screensaver.component';
import { DraftWallpaperComponent } from './draft-screensaver/draft-alert.component';

const routes: Routes = [
  { path: '', component: ScreensaverListComponent },
  { path: 'add', component: CreateScreensaverComponent },
  { path: ':id/:type', component: CreateScreensaverComponent },
  { path: ':id/:type/Alert/:edit', component: CreateScreensaverComponent },
  { path: 'send-user/:id/:type', component: SendUserAlertComponent },
  { path: 'draft', component: DraftWallpaperComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreensaverRoutingModule { }
