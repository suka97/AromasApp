import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-device-card',
  templateUrl: './device-card.component.html',
  styleUrls: ['./device-card.component.scss'],
})
export class DeviceCardComponent implements OnInit {
  //@Input() url: string
  //@Output() onDelete = new EventEmitter<any>();
  port: string = "80";
  time: string[] = ["500", "1000", "1500", "2000"];
  constructor() { }

  ngOnInit() {}

  getSendData() {

  }
}
