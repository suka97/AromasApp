import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(public navCtrl: NavController, private router: Router) { }

  ngOnInit() {
  }

  addDevice() {
    //this.navCtrl.navigateForward("device-settings");
    this.router.navigateByUrl("/device-settings", { queryParams: { 
      something: 55,
      hola: "22" 
    }} );
  }

}
