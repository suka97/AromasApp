import { Component, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { IonCard, IonButton, ToastController, LoadingController   } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { TimeInterval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private storage: Storage, public toastController: ToastController, public loadingController: LoadingController) {}

  @ViewChildren(IonCard) cards !: QueryList<IonCard>
  @ViewChild('card_0', {static: false}) card !: IonCard
  @ViewChild('connectBtn', {static: false}) connectBtn !: IonButton

  url: string = "192.168.1.1";  //"localhost";  //"192.168.1.128";
  port: string = "80";
  connection: WebSocket;
  time: string[] = ["500", "1000", "1500", "2000"];
  nombreAroma: string[] = ["", "", "", ""];
  connected: boolean = false;
  checkConnectionLoop: any;
  isLoading: boolean = false;

  ngAfterViewInit() {
    this.getDefaults().then(_=> {  });
    // check connection loop
    this.checkConnectionLoop = setInterval(() => {
      if ( this.connected ) {
        this.connection.send("check");
        console.log("check");
      }
    }, 1000);
  }

  getDefaults() {
    return Promise.all([
      this.storage.get("url"), this.storage.get("times"), 
      this.storage.get("port"), this.storage.get("nombreAromas")
    ]).then(values => {
      console.log(values);
        if ( values[0] != null )
          this.url = values[0];

        if ( values[1] != null ) {
          for( let i=0 ; i<this.time.length ; i++ ) {
            if ( values[1][i] != null ) 
              this.time[i] = values[1][i]
          }
        }

        if ( values[2] != null )
          this.port = values[2];

        if ( values[3] != null ) {
          for( let i=0 ; i<this.time.length ; i++ ) {
            if ( values[3][i] != null ) 
              this.nombreAroma[i] = values[3][i]
          }
        }
    });
  }

  connect() { 
    console.log("URL = "+ this.url + "\nPORT = " + this.port);

    if ( this.connected ) {
      if ( this.connection != null ) {
        console.log("Connection closed");
        this.connection.close();
      }
      this.connected = false;
      return;
    }

    /*  Guardo los datos  */
    this.storage.set('url', this.url);
    this.storage.set('port', this.port);
    this.storage.set('nombreAromas', this.nombreAroma);
    this.storage.set('times', this.time);
    
    this.connection = new WebSocket("ws://" + this.url + ":" + this.port + "/");
    this.presentLoading("Conectando");
    this.connection.onopen = (e)=>{
      this.connected = true;
      console.log("Connected");
      this.toast("Connected");
      this.connectBtn.color = "primary";
      this.dismissLoading();
    };
    this.connection.onclose = (e)=>{
      this.dismissLoading();
      this.connected = false;
      this.connectBtn.color = "danger";
      console.log("Disconnected");
      this.toast("Disconnected");
    };
    this.connection.onmessage = (e)=>{
      console.log("Server: " + e.data);
      let command: string[] = e.data.split("&");

      if ( command[1] == "OFF" ) { 
        this.cards[+command[0]] = "light";  // el '+' lo pasa a int
      }
      else if ( command[1] == "ON" ) {
        this.cards[+command[0]] = "danger";  // el '+' lo pasa a int
      }        
    };
  }

  clicked(index: number) {
    if ( this.connected ) {
      let millis: string = this.time[index];
      //console.log("time: " + millis);
      this.connection.send(index + "&" + millis);
    }
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
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }
  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

}
