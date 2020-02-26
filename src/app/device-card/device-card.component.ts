import { Component, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { DeviceType } from '../device.type';

@Component({
  selector: 'app-device-card',
  templateUrl: './device-card.component.html',
  styleUrls: ['./device-card.component.scss'],
})
export class DeviceCardComponent implements AfterViewInit {

  constructor() { }

  @Input() device: DeviceType
  @Output() error: EventEmitter<any> = new EventEmitter();

  port: string = "3000";
  rows: number[] = [0, 1, 2, 3];
  times: string[] = ["500", "500", "500", "500"];
  rowEnabled: boolean[] = [true, true, true, true];
  connected: boolean = false;
  connection: WebSocket;
  waitingResponse: boolean[] = [false, false, false, false];
  timersIds: ReturnType<typeof setTimeout>[] = new Array<ReturnType<typeof setTimeout>>(4); 

  ngAfterViewInit() {
  }

  connect() {
    var promise = new Promise((resolve, reject) => {
      if ( !this.connected ) {
        this.connection = new WebSocket("ws://" + this.device.url + ":" + this.port + "/");
        this.connection.onerror = (e)=>{
          console.log( "[" + this.device.name + "]: " + "Connection error" );
          this.error.emit(this.device.name);      // emit por si pasa despues de estar conectado
          resolve();      // resolve por si pasa al tratar de conectarse y falla
        };
        this.connection.onopen = (e)=>{
          this.connected = true;
          console.log( "[" + this.device.name + "]: " + "Connection opened" );
          resolve();
        };
        this.connection.onmessage = (e)=>{
          console.log( "["+this.device.name+"]: " + e.data );
          this.checkResponse(e.data);
        };
      }
      else
        resolve();
    });
    return promise;
  }

  checkResponse(response: string) {
    let responseSplitted: string[] = response.split("&");
    if ( responseSplitted.length != 2 ) {
      this.error.emit(this.device.name);
      return;
    }

    let rowNumber: number = parseInt(responseSplitted[0]);
    if ( (rowNumber < 0) || (rowNumber > 3) ) {
      this.error.emit(this.device.name);
      return;
    }
 
    if ( responseSplitted[1] == "ON" ) {
      if ( !this.waitingResponse[rowNumber] )
        this.error.emit(this.device.name);
      else {
        this.waitingResponse[rowNumber] = false;
        clearTimeout(this.timersIds[rowNumber]);
      }
    }
  }

  disconnect() {
    if ( this.connected ) {
      if ( this.connection != null ) {
        console.log( "[" + this.device.name + "]: " + "Connection closed" );
        this.connection.close();
      }
      this.connected = false;
    }
    return;
  }

  send() {
    for( let i=0 ; i<4 ; i++ ) {
      if ( this.rowEnabled[i] && !this.waitingResponse[i] ) {
        let sendString: string = i + "&" + this.times[i];
        console.log( "["+this.device.name+"] " + sendString );

        this.connection.send(sendString);
        this.waitingResponse[i] = true;
        // espero respuesta
        this.timersIds[i] = setTimeout(() => {
          this.error.emit(this.device.name);
        }, 2000);
      }
    }
  }

}
