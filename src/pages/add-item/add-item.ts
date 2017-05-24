import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController
                  , LoadingController, ModalController, ToastController
                  , ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { CONFIG } from '../../providers/constants.js';

/**
 * Generated class for the AddItem page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-add-item',
  templateUrl: 'add-item.html',
})
export class AddItemPage {

  placeId: number = 0;
  item: any;
  hasAdditions: boolean;

  additions: Array<any> = new Array();
  items: Array<any> = new Array();
  commingAdditions: Array<any> = new Array();

  additionsTotal: number = 0;
  total: number = 0;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http
                          , public storage: Storage, public loading: LoadingController
                          , public viewCtrl: ViewController) {
    this.placeId = navParams.get('place_id');
    this.item = navParams.get('item');
    this.total = parseInt(this.item.price);
    this.commingAdditions = navParams.get('additions');
    this.getAdditions(this.placeId, this.item.id);
  } 

  close(){
    this.viewCtrl.dismiss(null, null);
  }

  addToCart(){
    if(!this.item.hasOwnProperty("quantity")){
      this.item.quantity = 1;
    }

    let orderItem = {
      item: this.item,
      total: this.total,
      quantity: 1
    }
    let additionsItem = {
      additions: this.commingAdditions,
      total: this.additionsTotal
    }
    this.viewCtrl.dismiss(orderItem, additionsItem);
  }

  addItem(data){
    if(data.isAdded){
      data.isAdded = false;
      for (var i = 0; i < this.items.length; i++) {
        var element = this.items[i];
        if(element.id == data.id){
          this.items.splice(i, 1);
          this.commingAdditions.splice(i, 1);
        }
      }
      this.updateAdditionsTotal();
    } else {
      data.isAdded = true;
      data.quantity = 1;
      this.items.push(data);
      this.commingAdditions.push(data);
      this.updateAdditionsTotal();
    }
  }

  updateTotal(){
    this.total = parseInt(this.item.price);
    this.total = this.total + this.additionsTotal;
  }

  updateAdditionsTotal(){
    this.additionsTotal = 0;
    this.items.forEach(element =>{
      this.additionsTotal = this.additionsTotal + parseInt(element.price);
    });
    this.updateTotal();
  }

  initAdditions(){
    var initElements = new Array();
    this.additions.forEach(element => {
      element.isAdded = false;
      this.commingAdditions.forEach(commingElement => {
        if(element.id == commingElement.id){
          element.isAdded = true;
          initElements.push(element);
        }
      });
    });
    initElements.forEach(element => {
      this.items.push(element);
    });
    this.updateAdditionsTotal();
    this.updateTotal();
  }

  getAdditions(restaurantId, itemId){
    let loader = this.loading.create({content: "Espera un momento"});
    loader.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.storage.ready().then(() => {
      this.storage.get('token').then((token) => {
        this.http.get('http://' + CONFIG.host + '/incity/api/restaurant/' + restaurantId + '/item/' + itemId + '/additions?token=' + token, headers)
        .map(res => res.json())
        .subscribe(data => {
          loader.dismiss();
          console.log(data);
          this.additions = data.data;
          if(data.data){
            if(this.additions.length > 0){
              this.hasAdditions = true;
              this.initAdditions();
            } else {
              this.hasAdditions = false;
            }
          }
        }, error => {
          loader.dismiss();
          console.log(error);
        });
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItem');
  }

}
