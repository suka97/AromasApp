import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicStorageModule } from "@ionic/storage";

import { HomePage } from './home.page';
import {DeviceCardComponent} from '../../app/device-card/device-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicStorageModule.forRoot(),
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  entryComponents: [DeviceCardComponent],
  declarations: [HomePage, DeviceCardComponent]
})
export class HomePageModule {}
