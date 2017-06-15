import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { OrderDetailPage } from '../order-detail/order-detail';
import { CONFIG } from '../../providers/constants.js';

/**
 * Generated class for the Orders page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  orders: Array<any> = new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams
                      , public menuCtrl: MenuController, public loading: LoadingController
                      , public http: Http, public storage: Storage) {
              this.getOrderHistory();
  }

  open(){
    this.menuCtrl.open();
  }

  back(){
    this.navCtrl.pop();
  }

  openOrder(order){
    this.navCtrl.push(OrderDetailPage, {
      order_id: order.id,
      code: order.code
    });
  }

  getOrderHistory(){
    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        this.http.get("http://" + CONFIG.host + "/incity/api/order/history?token=" + token, headers)
        .map(res => res.json())
        .subscribe(data => {
          loader.dismiss();
          console.log(data);
          if(data.success == true){
            this.orders = data.orders;
          } else {
          }
        }, error => {
          loader.dismiss();
        });
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Orders');
  }

}
