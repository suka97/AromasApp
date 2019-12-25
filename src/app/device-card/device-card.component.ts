import { Component, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-device-card',
  templateUrl: './device-card.component.html',
  styleUrls: ['./device-card.component.scss'],
})
export class DeviceCardComponent implements AfterViewInit {

  constructor(private storage: Storage) { }

  @Input() id: number
  @Input() urlDevices: string[]
  //@Output() onDelete = new EventEmitter<any>();

  port: string = "80";
  times: string[] = ["500", "1000", "1500", "2000"];
  nombresAromas: string[] = ["Aroma1", "Aroma2", "Aroma3", "Aroma4"];
  rows: number[] = [0, 1, 2, 3];

  ngAfterViewInit() {
    this.getDefaults();
  }

  getSendData() {

  }

  getDefaults() {
    return Promise.all([
      this.storage.get( this.id + "nombresAromas" ),
      this.storage.get( this.id + "times" )
    ]).then(values => {
      //console.log(values);
      if ( values[0] != null ) 
        this.nombresAromas = values[0];
      if ( values[1] != null ) 
        this.times = values[1];
    });
  }
}
