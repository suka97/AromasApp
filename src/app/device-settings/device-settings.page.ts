import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController, Events } from "@ionic/angular";
import { DeviceType } from '../device.type'
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-device-settings',
  templateUrl: './device-settings.page.html',
  styleUrls: ['./device-settings.page.scss'],
})
export class DeviceSettingsPage implements OnInit {
  device: DeviceType = {
    name: "",
    url: "",
    aromasNames: ["","","",""]
  };
  devices: DeviceType[];
  id_fromParent: number;
  modifyingOldDevice: string;
  doneButton_text: string = "AGREGAR";

  constructor(private route: ActivatedRoute, public navCtrl: NavController, private events: Events, private storage: Storage) {
  }

  ngOnInit() {
    this.route.paramMap
     .subscribe((queryParams: ParamMap) => {
        this.id_fromParent = +queryParams.get('id');
        this.modifyingOldDevice = queryParams.get('modifyingOldDevice');
    });

    // si estoy modificando, pido los valores
    Promise.all([
      this.storage.get("devices")
    ]).then(values => {
      this.devices = values[0];

      if ( this.modifyingOldDevice != null ) {
        this.device = this.devices[this.id_fromParent];
        this.doneButton_text = "GUARDAR";   // en vez de "AGREGAR"
      }
      if ( this.devices == null )
        this.devices = [this.device];
    });
  }

  addDevice() {
    if ( this.device.aromasNames[0]!="" && this.device.aromasNames[1]!="" && this.device.aromasNames[2]!="" && this.device.aromasNames[3]!=""
            && this.device.name!="" && this.device.url!="" ) 
    {
      // si estoy creando uno nuevo lo pusheo en el array
      if ( this.modifyingOldDevice == null )
        this.devices.push(this.device);

      this.storage.set("devices", this.devices).then( values => {
        // vuelvo y notifico el evento al parent
        this.events.publish("device-settings-event", { });
        this.navCtrl.back();
      });
    }
  }

}
