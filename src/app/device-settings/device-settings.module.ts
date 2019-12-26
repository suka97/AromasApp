import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicStorageModule } from "@ionic/storage";

import { IonicModule } from '@ionic/angular';

import { DeviceSettingsPage } from './device-settings.page';

const routes: Routes = [
  {
    path: '',
    component: DeviceSettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicStorageModule.forRoot(),
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DeviceSettingsPage]
})
export class DeviceSettingsPageModule {}
