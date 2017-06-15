import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController
                  , LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { CONFIG } from '../../providers/constants.js';

/**
 * Generated class for the OrderDetail page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  items: Array<any> = new Array();
  additions: Array<any> = new Array();
  detail: Array<any> = new Array();

  itemsDetail: string;
  additionsDetail: string;
  orderCode: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController,
                      public menuCtrl: MenuController, public http: Http, public storage: Storage,
                      public alertCtrl: AlertController) {
              var orderId = navParams.get('order_id');
              this.orderCode = navParams.get('code');
              this.getDetail(orderId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetail');
  }

  open(){
    this.menuCtrl.open();
  }

  back(){
    this.navCtrl.pop();
  }

  setListsUp(){
    this.items = this.detail.filter((item) => {
      return item.is_addition == 0;
    });
    this.additions = this.detail.filter((item) => {
      return item.is_addition == 1;
    });

    var detail = '';
    for (var i = 0; i < this.items.length; i++) {
      var element = this.items[i];
      if(i == 0){
        detail = detail + element.name + " x " + element.quantity;
      } else {
        detail =  detail + ", " + element.name + " x " + element.quantity;
      }
    }
    console.log(detail);
    this.itemsDetail = detail;
    
    var detail = '';
    for (var i = 0; i < this.additions.length; i++) {
      var element = this.additions[i];
      if(i == 0){
        detail = detail + element.name + " x " + element.quantity;
      } else {
        detail =  detail + ", " + element.name + " x " + element.quantity;
      }
    }
    console.log(detail);
    this.additionsDetail = detail;
  }

  getDetail(orderId: number){
    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        this.http.get('http://' + CONFIG.host + '/incity/api/order/' + orderId + '/detail?token=' + token, headers)
        .map(res => res.json())
        .subscribe(data => {
          loader.dismiss();
          console.log(data);
          this.detail = data.detail;
          if(this.detail.length > 0){
            this.setListsUp();
          }
        }, error => {
          loader.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Intentelo de nuevo mas tarde',
            buttons: ['OK']
          });
          alert.present();
        });
      });
    });
  }

}
