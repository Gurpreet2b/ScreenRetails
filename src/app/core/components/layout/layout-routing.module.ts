import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { LayoutComponent } from './components/layout.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', redirectTo: 'dashboard' },
      { path: 'dashboard', loadChildren: () => import('../../../main/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'create-alerts', loadChildren: () => import('../../../main/components/create-alert/create-alert.module').then(m => m.CreateAlertModule) },
      // { path: 'video-alerts', loadChildren: () => import('../../../main/components/video/video.module').then(m => m.VideoModule) },
      { path: 'create-survey', loadChildren: () => import('../../../main/components/survey/survey.module').then(m => m.SurveyModule) },
      // { path: 'opt-list', loadChildren: () => import('../../../main/components/opt/opt.module').then(m => m.OPTModule) },
      { path: 'publisher-list', loadChildren: () => import('../../../main/components/publishers/publishers.module').then(m => m.PublishersModule) },
      // { path: 'skin-list', loadChildren: () => import('../../../main/components/skin/skin.module').then(m => m.SkinModule) },
      { path: 'message', loadChildren: () => import('../../../main/components/message/message.module').then(m => m.MessageModule) },
      { path: 'device', loadChildren: () => import('../../../main/components/device/device.module').then(m => m.DeviceModule) },
      // { path: 'screensaver', loadChildren: () => import('../../../main/components/screensaver/screensaver.module').then(m => m.ScreensaverModule) },
      // { path: 'wallpaper', loadChildren: () => import('../../../main/components/wallpaper/wallpaper.module').then(m => m.WallpaperModule) },
      // { path: 'ipgroup', loadChildren: () => import('../../../main/components/ipgroup/ipgroup.module').then(m => m.IpgroupModule) },
      // { path: 'lockscreen', loadChildren: () => import('../../../main/components/lockscreen/lockscreen.module').then(m => m.LockscreenModule) },
      { path: 'policies', loadChildren: () => import('../../../main/components/policies/policies.module').then(m => m.PoliciesModule) },
      { path: 'emergency', loadChildren: () => import('../../../main/components/emergency/emergency.module').then(m => m.EmergencyModule) },
      { path: 'reports', loadChildren: () => import('../../../main/components/reports/reports.module').then(m => m.ReportsModule) },
      { path: 'domains', loadChildren: () => import('../../../main/components/domains/domains.module').then(m => m.DomainsModule) },
      { path: 'synchronizations', loadChildren: () => import('../../../main/components/synchronization/synchronization.module').then(m => m.SynchronizationModule) },
      { path: 'organization', loadChildren: () => import('../../../main/components/organization-audience/organization.module').then(m => m.OrganizationModule) },
      { path: 'settings', loadChildren: () => import('../../../main/components/settings/settings.module').then(m => m.SettingsModule) },
      { path: 'approval', loadChildren: () => import('../../../main/components/approval/approval.module').then(m => m.ApprovalModule) },
      { path: 'rejected', loadChildren: () => import('../../../main/components/rejected/rejected.module').then(m => m.RejectedModule) },
    ],
    canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
