import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoAlertComponent } from './components/video-alert.component';
import { VideoListComponent } from './video-list/video-list.component';

const routes: Routes = [
  { path: '', component: VideoAlertComponent },
  { path: ':id/:type', component: VideoAlertComponent },
  { path: 'list', component: VideoListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoAlertRoutingModule { }
