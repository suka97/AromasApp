import { Component, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { IonCard, IonButton, ToastController, LoadingController, NavController, Events } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { TimeInterval } from 'rxjs';
import { DeviceCardComponent } from '../../app/device-card/device-card.component';
import { setIndex } from '@ionic-native/core/decorators/common';
import { DeviceType } from '../device.type'

import { ConnectPage } from '../connect/connect.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  constructor(private storage: Storage, public toastController: ToastController, private events: Events, 
      public loadingController: LoadingController, public navCtrl: NavController) {   }

  @ViewChildren(DeviceCardComponent) devicesArray !: QueryList<DeviceCardComponent>
  indexes: number[];
  devices: DeviceType[];
  connected: boolean = false;
  connectBtn_text: string = "CONECTAR";
  connectBtn_color: string = "primary";

  ngAfterViewInit() {
    this.events.subscribe("settings-event", (values)=>{
      //console.log("settings-event");
      this.getDevices();
    });
    this.getDevices().then(_=> {  });
  }

  getDevices() {
    return Promise.all([
      this.storage.get("devices")
    ]).then(values => {
      this.devices = values[0];
      if ( this.devices != null )
        this.indexes = Array.from(Array(this.devices.length).keys());
    });
  }

  connect() { 
    console.log("connect");
    this.devicesArray.forEach( device=> {
      device.connect();
    });
    this.connected = !this.connected;
    if ( this.connected ) {
      this.connectBtn_text = "DESCONECTAR";
      this.connectBtn_color = "danger"
    }
    else {
      this.connectBtn_text = "CONECTAR";
      this.connectBtn_color = "primary"
    }
  }

  settings() {
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
      device.send();
    });
  }

}
