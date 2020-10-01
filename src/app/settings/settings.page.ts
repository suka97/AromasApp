import { Component, OnInit } from '@angular/core';
import { NavController, Events } from "@ionic/angular";
import { Router } from '@angular/router';
import { DeviceType } from '../device.type'
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  devices: DeviceType[];
  indexes: number[];
  showSecondsLabel: boolean = false;

  constructor(public navCtrl: NavController, private router: Router, private events: Events, private storage: Storage) { }

  ngOnInit() {
    this.events.subscribe("device-settings-event", (values)=>{
      this.updateDevicesList();
      this.events.publish("settings-event", { });
    });

    this.updateDevicesList();
    this.getOptions();
  }

  getOptions() {
    return Promise.all([
      this.storage.get("timeDisplayMode")
    ]).then(values => {
      this.showSecondsLabel = (values[0]=="both") ? true : false;
    });
  }

  showOptChanged() {
    this.storage.set("timeDisplayMode", (this.showSecondsLabel)?"both":"range").then( values => {
      this.events.publish("settings-event", { });
    });
  }

  addDevice() { 
    let id_toSend = 0;
    if ( this.devices != null )
      id_toSend = this.devices.length;

    this.router.navigate(['/device-settings', { 
        id: id_toSend
    }]);
  }

  modifyDevice(deviceSelected: number) {
    this.router.navigate(['/device-settings', { 
      id: deviceSelected, modifyingOldDevice: "SI"
  }]);
  }

  updateDevicesList() {
    // timeout 100ms para que ande bien en android... 
    setTimeout(()=>{ //console.log("updateDeviceList");
      Promise.all([
          this.storage.get("devices")
        ]).then(values => {
          this.devices = values[0];
          if ( this.devices != null )
            this.indexes = Array.from(Array(this.devices.length).keys());
        });
    }, 100);
  }

  deleteDevice(deviceIndex: number) {
    this.indexes = Array.from(Array(this.devices.length - 1).keys());
    this.devices.splice(deviceIndex, 1);
    this.storage.set("devices", this.devices).then( values => {
      this.events.publish("settings-event", { });
    });
  }

}
