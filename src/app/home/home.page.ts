import { Component, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { IonCard, IonButton } from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

  @ViewChildren(IonCard) cards !: QueryList<IonCard>
  @ViewChild('card_0', {static: false}) card !: IonCard;
  @ViewChild('connectBtn', {static: false}) connectBtn !: IonButton

  url: string = "localhost";  //"192.168.1.128";
  connection: WebSocket;
  time: string[] = ["00:00:01", "00:00:02", "00:00:03", "00:00:04"];
  state: string[] = ["LED_OFF", "LED_OFF", "LED_OFF", "LED_OFF"];

  ngAfterViewInit() {
    this.connect();
  }

  connect() {
    if ( this.connection != null ) {
      if ( this.connection.OPEN ) {
        this.connection.close();
      }
    }
    
    this.connection = new WebSocket("ws://" + this.url + ":3001/");
    this.connection.onopen = (e)=>{
      console.log("Connected");
      this.connectBtn.color = "primary";

      this.connection.onclose = (e)=>{
        this.connectBtn.color = "danger";
      };
      this.connection.onmessage = (e)=>{
        console.log("Server: " + e.data);

        if ( e.data == "LED_OFF" ) { 
          this.state[0] = e.data;
          this.card.color = "light";
        }
        else if ( e.data == "LED_ON" ) {
          this.state[0] = e.data;
          this.card.color = "danger";
        }
      };
    };
  }

  clicked(index: number) {
    let millis: string = this.time[index].split(":")[2];
    console.log("time: " + millis);
    let nextState: string = (this.state[index] == "LED_OFF") ? "LED_ON" : "LED_OFF";
    this.connection.send(nextState);
    this.state[index] = nextState;
  }

}
