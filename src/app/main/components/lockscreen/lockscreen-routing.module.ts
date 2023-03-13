import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendUserAlertComponent } from '../wallpaper/send-user-alert/send-user-alert.component';
import { LockscreenListComponent } from './components/lockscreen-list.component';
import { CreateLockscreenComponent } from './create-lockscreen/create-lockscreen.component';
import { DraftWallpaperComponent } from './draft-lockscreen/draft-alert.component';
//import { CreateScreensaverComponent } from './create-screensaver/create-screensaver.component';
const routes: Routes = [
  { path: '', component: LockscreenListComponent },
  { path: 'add', component: CreateLockscreenComponent },
  { path: ':id/:type', component: CreateLockscreenComponent },
  { path: ':id/:type/Alert/:edit', component: CreateLockscreenComponent },
  { path: 'send-user/:id/:type', component: SendUserAlertComponent },
  { path: 'draft', component: DraftWallpaperComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LockscreenRoutingModule { }
