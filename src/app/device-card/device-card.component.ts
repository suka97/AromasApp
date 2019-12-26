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
  //@Output() onDelete = new EventEmitter<any>();

  rows: number[] = [0, 1, 2, 3];
  times: string[] = ["500", "500", "500", "500"];
  connected: boolean = false;

  ngAfterViewInit() {
  }

  connect() {
    this.connected = !this.connected;
  }

  send() {
    console.log("send")
  }

}
