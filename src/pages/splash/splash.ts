import { Component } from '@angular/core';
import {NavController, NavParams, MenuController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { CONFIG } from '../../providers/constants.js';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  constructor(public navCtrl: NavController, public navParams: NavParams
                  , public menu: MenuController) {
    this.menu.enable(false);
  }
  
  ionViewDidLoad() {
    setTimeout(() => { 
      this.openLogin();
    }, 3000);
  } 

  openLogin(){
    this.navCtrl.push(LoginPage).then(() => {
      const index = this.navCtrl.getActive().index;
      this.navCtrl.remove(0, index);
    });
  }

}
