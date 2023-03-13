import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WallpaperListComponent } from './components/wallpaper-list.component';
import { CreateWallpaperComponent } from './create-wallpaper/create-wallpaper.component';
import { DraftWallpaperComponent } from './draft-wallpaper/draft-alert.component';
import { SendUserAlertComponent } from './send-user-alert/send-user-alert.component';

const routes: Routes = [
  { path: '', component: WallpaperListComponent },
  { path: 'add', component: CreateWallpaperComponent },
  { path: ':id/:type', component: CreateWallpaperComponent },
  { path: ':id/:type/Alert/:edit', component: CreateWallpaperComponent },
  { path: 'draft', component: DraftWallpaperComponent},
  { path: 'send-user/:id/:type', component: SendUserAlertComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WallpaperRoutingModule { }
