import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the Profile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  firstName: string;
  lastName: string;
  mail: string;
  phone: string;
  address: string;

  constructor(public navCtrl: NavController, public navParams: NavParams
                        , public menu: MenuController, public loading: LoadingController
                        , public http: Http, public storage: Storage) {
      this.menu.enable(true);
  }

  getData(){
    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        this.http.get('https://incitybackend.000webhostapp.com/profile?token='+token, headers)
        .map(res => res.json())
        .subscribe(data => {
          loader.dismiss();
          this.firstName = data.data.first_name;
          this.lastName = data.data.last_name;
          this.mail = data.data.mail;
          this.address = data.data.address;
          this.phone = data.data.phone;
          console.log(data);
        }, error => {
          loader.dismiss();
          console.log(error);
        });
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Profile');
    this.getData();
  }

  open(){
    this.menu.open();
  }

}
