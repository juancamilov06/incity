import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { PlacesPage } from '../places/places';

/**
 * Generated class for the Start page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController) {
    this.menu.enable(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Start');
  }

  open(){
    this.menu.open();
  }

  openRestaurants(){
    this.navCtrl.push(PlacesPage, {
      option: 'Domicilios'
    });
  }

  openProfile(){
    this.navCtrl.push(ProfilePage);
  }

}
