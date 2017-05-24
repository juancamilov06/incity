import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the Cities page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-cities',
  templateUrl: 'cities.html',
})
export class CitiesPopOver {

  cities: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
                      public viewCtrl: ViewController) {
    this.initArray();
  }

  selectCity(data){
    console.log(data);
    this.viewCtrl.dismiss(data.id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Cities');
  }

  initArray(){
    this.cities = [
      {id: 1, name: 'Medellin'},
      {id: 2, name: 'Monteria'}
    ];
  }

}
