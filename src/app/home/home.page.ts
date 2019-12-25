import { Component, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { IonCard, IonButton, ToastController, LoadingController, NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { TimeInterval } from 'rxjs';
import { DeviceCardComponent } from '../../app/device-card/device-card.component';
import { setIndex } from '@ionic-native/core/decorators/common';

import { ConnectPage } from '../connect/connect.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  constructor(private storage: Storage, public toastController: ToastController, 
      public loadingController: LoadingController, public navCtrl: NavController) {   }

  @ViewChildren(IonCard) cards !: QueryList<IonCard>
  @ViewChild('card_0', {static: false}) card !: IonCard
  @ViewChild('connectBtn', {static: false}) connectBtn !: IonButton
  @ViewChildren(DeviceCardComponent) devicesArray !: QueryList<DeviceCardComponent>

  urlDevices: string[] = ["192.168.1.1"];  //"localhost";  //"192.168.1.128";
  deviceIDs: number[] = [0];

  ngAfterViewInit() {
    this.getURLs().then(_=> {  });
  }

  getURLs() {
    return Promise.all([
      this.storage.get("urlDevices")
    ]).then(values => {
      //console.log(values);
      if ( values[0] != null ) {
        this.urlDevices = values[0];
        console.log(this.urlDevices);

        // agrego los dispositivos y actualizo las URLs
        while ( this.urlDevices.length > this.deviceIDs.length )
          this.deviceIDs.push( this.deviceIDs[this.deviceIDs.length-1] + 1 );
      }
    });
  }

  connect() { 
    //this.navCtrl.navigateForward("connect");
    this.navCtrl.navigateForward("settings");
  }

  async toast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

  /*
  async presentLoading(message: string, duration: number = 30000) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: message,
      duration: duration
    }).then(a => {
      a.present().then(() => {
        //console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }
  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }
  */

  send() {
    this.devicesArray.forEach( device=> {
      console.log("hola");
      console.log(device.id);
    });
  }

}
