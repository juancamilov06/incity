import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, PopoverController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { PlacesPage } from '../places/places';
import { Http } from '@angular/http';
import { CitiesPopOver } from '../cities/cities';
import { Storage } from '@ionic/storage';
import { CONFIG } from '../../providers/constants.js';

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

  promos: Array<any> = new Array();

  firstName: string;
  lastName: string;
  comesFromCreation: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams
                  , public menu: MenuController, public loading: LoadingController
                  , public storage: Storage, public http: Http, public popoverCtrl: PopoverController) {
    this.menu.enable(true);
    this.comesFromCreation = this.navParams.get('fromCreation');
    this.getData();
    this.getPromos();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Start');
  }

  openPopOver(event){
    let popover = this.popoverCtrl.create(CitiesPopOver);
    popover.present({
      ev: event
    });

    popover.onDidDismiss((data) => {
      if(data != null){
        this.storage.ready().then(() =>{
          this.storage.set('city_id', data).then(() => {
            this.getPromos();
          });
        });
      }
    })
  }

  getPromos(){
    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        this.storage.get('city_id').then((cityId) => {
          this.http.get('http://' + CONFIG.host +'/incity/api/promos/' + cityId + '?token='+token, headers)
          .map(res => res.json())
          .subscribe(data => {
            loader.dismiss();
            this.promos = data.promos;
            console.log(data);
          }, error => {
            loader.dismiss();
            console.log(error);
          });
        });
      });
    });
  }

  getData(){
    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        this.http.get('http://' + CONFIG.host +'/incity/api/profile?token='+token, headers)
        .map(res => res.json())
        .subscribe(data => {
          loader.dismiss();
          this.firstName = data.data.first_name;
          this.lastName = data.data.last_name;
          if(this.comesFromCreation){
            console.log('CREAAAAAAAAAAAAAAAAAADO');
          }
          console.log(data);
        }, error => {
          loader.dismiss();
          console.log(error);
        });
      });
    });
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
