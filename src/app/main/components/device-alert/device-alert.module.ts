import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceAlertRoutingModule } from './device-alert-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DeviceAlertComponent } from './device-alert/device-alert.component';

@NgModule({
  declarations: [DeviceAlertComponent],
  imports: [
    CommonModule,
    DeviceAlertRoutingModule,
    ReactiveFormsModule
  ]
})
export class DeviceAlertModule { }
