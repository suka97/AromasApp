import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-device-settings',
  templateUrl: './device-settings.page.html',
  styleUrls: ['./device-settings.page.scss'],
})
export class DeviceSettingsPage implements OnInit {
  urlDevice: string;
  nombreAroma: string[] = ["", "", "", ""];

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap
     .subscribe((queryParams: ParamMap) => {
        this.urlDevice = queryParams.get('hola');
    });
    console.log(this.urlDevice);
  }

  addDevice() {
    //this.navCtrl.navigateBack();
  }

}
