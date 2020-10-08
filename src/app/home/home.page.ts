import { Component, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { IonCard, IonButton, ToastController, LoadingController, NavController, Events } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { TimeInterval } from 'rxjs';
import { DeviceCardComponent } from '../../app/device-card/device-card.component';
import { setIndex } from '@ionic-native/core/decorators/common';
import { DeviceType } from '../device.type'
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { ConnectPage } from '../connect/connect.page';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  constructor(private storage: Storage, public toastController: ToastController, private events: Events, 
      public loadingController: LoadingController, public navCtrl: NavController, private splashScreen: SplashScreen) {   }

  @ViewChildren(DeviceCardComponent) devicesArray !: QueryList<DeviceCardComponent>
  indexes: number[];
  devices: DeviceType[];
  connected: boolean = false;
  connectBtn_text: string = "CONECTAR";
  connectBtn_color: string = "primary";
  isLoading: boolean = false;
  timeDisplayMode: string;

  ngAfterViewInit() {
    this.events.subscribe("settings-event", (values)=>{
      this.getOptions().then(_=> {
        this.getDevices().then(_=> {  });
      });
    });
    this.getOptions().then(_=> {
      this.getDevices().then(_=> {  });
    });
  }

  getOptions() {
    return Promise.all([
      this.storage.get("timeDisplayMode")
    ]).then(values => {
      this.timeDisplayMode = (values[0]!=null) ? values[0] : "range";
    });
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

  connectClicked() { 
    if ( !this.connected ) {
      this.presentLoading("Conectando", 100000);
      this.devicesArray.forEach( device=> {
        device.connect().then(() => { 
          // si no se conecto es que hubo un error y corto todo
          if ( !device.connected ) {
            this.dismissLoading();
            this.toast( "[" + device.device.name + "] " + "Error de coneccion " );
          }
          // en la desconeccion de este dispositivo
          device.connection.onclose = (e)=>{
            this.disconnectDevices();
            console.log( "[" + device.device.name + "]: " + "Disconnected" );
          };
          // reviso si estan todos ya conectados para ver si saco el toast
          let allConnected = true;
          this.devicesArray.forEach( device=> {
            if (!device.connected) allConnected = false;
          });
          if (allConnected) {
            this.toast("Dispositivos conectados");
            this.dismissLoading();
            this.connected = true;
            this.connectBtn_text = "DESCONEC";
            this.connectBtn_color = "danger"
          }
        });
      });
    }
    else
      this.disconnectDevices();
  }

  disconnectDevices() {
    if ( this.connected ) {
      this.connected = false;
      this.devicesArray.forEach( device=> {
        device.disconnect();
      });
      // cambio los colores y texto del boton
      this.connectBtn_text = "CONECTAR";
      this.connectBtn_color = "primary";
      this.toast("Dispositivos desconectados");
    }
  }

  settings() {
    this.disconnectDevices();
    this.navCtrl.navigateForward("settings");
  }

  async toast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.present();
  }


  async presentLoading(message: string, duration: number = 30000) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: message,
      duration: duration
    }).then(a => {
      a.present().then(() => {
        //console.log('presented');
        if (!this.isLoading) {
          a.dismiss()/*.then(() => console.log('abort presenting'))*/;
        }
      });
    });
  }
  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss()/*.then(() => console.log('dismissed'))*/;
  }
  

  send() {
    this.devicesArray.forEach( device=> { console.log("send");
      device.send();
    });
  }

  onConnectionError(deviceName: string) {
    console.log( "[" + deviceName + "] " + "Connection error" );
    this.disconnectDevices();
    this.toast( "[" + deviceName + "] " + "Error de coneccion " );
  }

}
