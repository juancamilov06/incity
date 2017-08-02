import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController
                  , LoadingController, ModalController, ToastController
                  , ViewController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { CONFIG } from '../../providers/constants.js';

/**
 * Generated class for the ShoppingCart page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {

  place: any;
  user: any;
  number: number;
  date: Date = new Date('29/09/2017');
 
  constructor(public navCtrl: NavController, public navParams: NavParams,
                        public viewCtrl: ViewController, public alertCtrl: AlertController,
                        public toastCtrl: ToastController, public http: Http,
                        public storage: Storage, public loading: LoadingController) {
          this.place = navParams.get('place');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingCart');
    this.getCurrentUser();
  }

  getCurrentUser(){
    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        this.http.get('http://' + CONFIG.host +'/incity/api/user/?token=' + token, headers)
          .map(res => res.json())
          .subscribe(data => {
            loader.dismiss();
            this.user = data.data;
            console.log(data);
          }, error => {
            loader.dismiss();
            console.log(error);
          });
      });
    });
  }

  getBooking(): any{
    return {
      place_id: this.place.id,
      date: this.date.toString(),
      people_number: this.number,
      user_id: this.user.id,
      booking_status_id: 1
    }
  }

  requestBooking(){
    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let body = new FormData();
    body.append("booking", JSON.stringify(this.getBooking()));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        this.http.post('http://' + CONFIG.host +'/incity/api/booking?token=' + token, body, headers)
          .map(res => res.json())
          .subscribe(data => {
            loader.dismiss();
            if(data.success = true){
              this.complete();
              return
            } 
            this.error();
          }, error => {
            loader.dismiss();
            this.error();
          });
      });
    });
  }

  complete(){
    let data = {
      success: true
    }
    this.viewCtrl.dismiss(data);
  }

  error(){
    let data = {
      success: false
    }
    this.viewCtrl.dismiss(data);
  }

  back(){
    let data = {
      closed: true
    }
    this.viewCtrl.dismiss(data);
  }

}
